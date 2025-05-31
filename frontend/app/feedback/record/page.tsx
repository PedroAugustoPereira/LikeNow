"use client";

import { useState, useRef, useEffect } from 'react';
import { FaHome, FaMicrophone, FaKeyboard, FaPaperPlane, FaPlay, FaPause } from 'react-icons/fa';
import { IoMdMic, IoMdSend } from 'react-icons/io';
import Image from 'next/image';
import Link from 'next/link';
import WaveSurfer from "wavesurfer.js";
import { transcreverAudio } from '../../utils/transcribe';
import { useRouter } from 'next/navigation'; 
import authService from '@/services/auth_service';
import feedbackService, { SendFeedbackData } from '@/services/feedback_service';
import userService from '@/services/user_service';
import teamService from '@/services/team_service';
import { enviarParaOpenAI } from '@/app/utils/makeSuma';
import LoadingAnimation from '@/app/components/loading_animation';

export default function RecordPage() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const router = useRouter(); // Inicialize o router
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading
  const [receiverUserId, setReceiverUserId] = useState<string | null>(null);

  
  // Verifica autenticação e obtém o ID do destinatário
  useEffect(() => {
    authService.checkAuthentication();
    
    // Obtém o ID do destinatário (pode ser do localStorage ou de uma API)
    async function fetchReceiverId() {
      try {
        // Exemplo: pegar o líder do time do usuário atual
        const userId = localStorage.getItem('user_id');
        if (!userId) return;
        
        const user = await userService.getUserById(userId);
        if (user.team_id) {
          const team = await teamService.getTeamById(user.team_id);
          setReceiverUserId(team.leaderId);
        }
      } catch (error) {
        console.error('Erro ao obter destinatário:', error);
        // Pode definir um destinatário padrão ou lidar com o erro
      }
    }
    
    fetchReceiverId();
  }, []);
  // Carrega o valor salvo ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("isAnonymous");
    if (saved === "true") setIsAnonymous(true);
  }, []);

  // Salva o valor sempre que mudar
  useEffect(() => {
    localStorage.setItem("isAnonymous", isAnonymous ? "true" : "false");
    if (isAnonymous) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isAnonymous]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isWaveReady, setIsWaveReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Efeito para aplicar dark mode quando anônimo
  useEffect(() => {
    if (isAnonymous) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isAnonymous]);

  // Focar no textarea quando abrir
  useEffect(() => {
    if (showTextInput && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [showTextInput]);

  // Efeito para WaveSurfer
  useEffect(() => {
    if (audioUrl && waveformRef.current) {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#fbbf24",
        progressColor: "#ea580c",
        height: 48,
        barWidth: 2,
        cursorColor: "#ea580c",
      });
      wavesurferRef.current.load(audioUrl);

      wavesurferRef.current.on("ready", () => setIsWaveReady(true));
      wavesurferRef.current.on("play", () => setIsPlaying(true));
      wavesurferRef.current.on("pause", () => setIsPlaying(false));
      wavesurferRef.current.on("finish", () => setIsPlaying(false));
    }
    return () => {
      wavesurferRef.current?.destroy();
      setIsWaveReady(false);
      setIsPlaying(false);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setShowTextInput(false); // Fecha o texto se estiver aberto
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Não foi possível acessar o microfone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {

      if (audioUrl && !showTextInput) {
        const response = await fetch(audioUrl);
        const audioBlob = await response.blob();
        let textoTranscrito = await transcreverAudio(audioBlob);
        textoTranscrito = await enviarParaOpenAI(textoTranscrito|| "") || "";

        // Salva localmente para review
        localStorage.setItem(
          "ultimoFeedback",
          JSON.stringify({
            isAnonymous,
            audioUrl,
            textoTranscrito,
            tipo: "audio",
            data: new Date().toISOString(),
          })
        );
      } else {
        let texto = await enviarParaOpenAI(feedbackText|| "") || "";
        
        // Salva localmente para review
        localStorage.setItem(
          "ultimoFeedback",
          JSON.stringify({
            isAnonymous,
            text: texto,
            tipo: "texto",
            data: new Date().toISOString(),
          })
        );
      }


      // Redireciona para a tela de review
      router.push('/feedback/review');
      
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      alert('Erro ao enviar feedback. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative ${isAnonymous ? 'dark:bg-gray-900 dark:text-white' : 'bg-gray-50 text-gray-500'}`}>
      {/* Overlay de Loading */}
      {isLoading && (
        <LoadingAnimation isSaving={false} isAnonymous={isAnonymous} />
      )}
      {/* Cabeçalho */}
      <header className="flex justify-between items-center p-4">
        {/* Toggle Anônimo */}
        <div className="flex items-center">
          <label htmlFor="anonymous-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="anonymous-toggle" 
                className="sr-only" 
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <div className={`block w-14 h-8 rounded-full ${isAnonymous ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isAnonymous ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium">
              {isAnonymous ? 'Anônimo' : 'Identificado'}
            </span>
          </label>
        </div>

        {/* Ícone Home */}
        <Link href="/" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <FaHome className="text-4xl" />
        </Link>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        {/* Ícone do Aplicativo (central) */}
        <div className="mb-12">
          <Image
            src={isAnonymous ? "/images/lino_anom"+ (isRecording ? "_listen" : "") +".png" : "/images/lino"+ (isRecording ? "_listen" : "") +".png"}
            alt={isAnonymous ? "Logo Anônimo" : "Logo Lino"}
            width={150}
            height={150}
            className="mx-auto transition-all duration-300"
            priority
          />
        </div>

        {/* Botão de Gravação */}
        <div className="mb-8 flex flex-col items-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-6 rounded-full ${isRecording 
              ? 'bg-red-500 animate-pulse' 
              : 'bg-orange-600 hover:bg-orange-700'} 
              text-white shadow-lg transition-all duration-300`}
          >
            {isRecording ? <IoMdMic size={40} /> : <FaMicrophone size={40} />}
          </button>
          <span className="mt-4 text-sm">
            {isRecording ? 'Gravando... Clique para parar' : 'Clique para gravar'}
          </span>
        </div>

        {/* Link "ou digite..." */}
        <button
          onClick={() => {
            setShowTextInput(!showTextInput);
            if (audioUrl) setAudioUrl(null); // Limpa o áudio se estiver gravado
          }}
          className="text-primary dark:text-primary hover:underline flex items-center mb-4"
        >
          <FaKeyboard className="mr-2" />
          {showTextInput ? 'Ou grave seu feedback' : 'Ou digite seu feedback'}
        </button>

        {/* Textarea para digitação */}
        {showTextInput && (
          <div className="w-full max-w-md mb-4 transition-all duration-300">
            <textarea
              ref={textAreaRef}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Digite seu feedback aqui..."
              className={`w-full p-4 border  ${isAnonymous ? 'dark:border-gray-600 dark:bg-gray-800 dark:text-white' : 'border-gray-300  rounded-lg focus:outline-none focus:ring-2 bg-stone-100 focus:ring-primary '}`}
              rows={4}
            />
            <button 
              onClick={handleSubmit}
              disabled={!feedbackText.trim()}
              className={`mt-2 w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 ${
                !feedbackText.trim()
                  ? isAnonymous
                    ? 'bg-gray-800 text-white opacity-60 cursor-not-allowed'
                    : 'bg-primary text-white border border-primary opacity-60 cursor-not-allowed'
                  : isAnonymous
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-primary text-white border border-primary hover:bg-secundary'
              }`}
            >
              Enviar para o Lino <FaPaperPlane />
            </button>
          </div>
        )}

        {/* Visualização do áudio gravado */}
        {audioUrl && !showTextInput && (
          <div className="mt-4 w-full max-w-md">
            <div ref={waveformRef} className="w-full mb-2" />
            <div className="flex gap-2">
              <button
                onClick={() => wavesurferRef.current?.playPause()}
                className="p-4 rounded-full bg-orange-400 hover:bg-orange-500 text-white"
                disabled={!isWaveReady}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 bg-orange-400 hover:bg-orange-500 text-white rounded-full flex items-center justify-center gap-2"
              >
                Enviar para o Lino <FaPaperPlane />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}