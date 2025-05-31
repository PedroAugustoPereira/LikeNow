"use client";

import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaKeyboard, FaArrowLeft, FaPaperPlane, FaArrowUp } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { transcreverAudio } from '../../utils/transcribe';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth_service';

export default function ReviewPage() {
  const [needsResponse, setNeedsResponse] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewText, setReviewText] = useState("");
  const [displayedReviewText, setDisplayedReviewText] = useState("");
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [reviewConcluido, setReviewConcluido] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); // Novo estado para controlar o loading
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Armazena o blob do áudio
  const maxReloads = 5;
  const router = useRouter();
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Referências para gravação de áudio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  useEffect(() => {
    authService.checkAuthentication();
  }, []);

  // Efeito para animação de digitação
  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 20;

    if (reviewText.length > 0 && displayedReviewText.length < reviewText.length) {
      const timer = setInterval(() => {
        setDisplayedReviewText(reviewText.substring(0, currentIndex));
        currentIndex++;
        
        if (textContainerRef.current) {
          textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
        }

        if (currentIndex > reviewText.length) {
          clearInterval(timer);
        }
      }, typingSpeed);

      return () => clearInterval(timer);
    }
  }, [reviewText]);

  useEffect(() => {
    const saved = localStorage.getItem("ultimoFeedback");
    if (saved != null) {
      try {
        const obj = JSON.parse(saved);
        const text = obj.textoTranscrito || obj.text || "";
        setReviewText(text);
      } catch {
        setReviewText(saved);
      }
    }
  }, []);

  // Função para iniciar gravação
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob); // Armazena o blob para transcrição posterior
        setAudioRecorded(true);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setShowTextInput(false);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Não foi possível acessar o microfone');
    }
  };

  // Função para parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAudioRecorded(true);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const toggleTextInput = () => {
    setShowTextInput(!showTextInput);
    setIsRecording(false);
  };

  const handleReload = async () => {
    if ((!feedbackText.trim() && !audioBlob) || reloadCount >= maxReloads) return;

    setIsProcessing(true); // Ativa o loading

    try {
      let textoParaAdicionar = feedbackText;

      // Se tivermos um áudio gravado mas não texto digitado, faz a transcrição
      if (audioBlob && !feedbackText.trim()) {
        textoParaAdicionar = await transcreverAudio(audioBlob)|| "";
      }

      if (textoParaAdicionar.trim()) {
        const newText = reviewText + (reviewText ? "\n\n" : "") + textoParaAdicionar.trim();
        setReviewText(newText);
        setFeedbackText("");
        setAudioBlob(null);
        setAudioRecorded(false);
        setShowTextInput(false);
        setReloadCount(count => count + 1);
        setNeedsResponse(false);

        if (reloadCount + 1 >= maxReloads) {
          setReviewConcluido(true);
        }
      }
    } catch (error) {
      console.error('Erro ao processar:', error);
      alert('Ocorreu um erro ao processar seu feedback');
    } finally {
      setIsProcessing(false); // Desativa o loading
    }
  };

  const handleSubmit = () => {
    console.log('Feedback enviado:', {
      reviewText,
      responseText: feedbackText,
      needsResponse
    });
    router.push('/feedback/sended');
  };

  // Se estiver processando, mostra o overlay de loading
  if (isProcessing) {
    return (
        <div
        className="min-h-screen font-sans flex flex-col items-center justify-center transition-colors duration-300 bg-gray-50 text-gray-700"
      >
        <img
          src="/images/lino_think.png"
          alt="Logo Lino"
          className="h-40 mb-8"
        />
        <p className="text-xl text-center mb-8">
          Pensando na melhor resposta para você...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho com logo */}
      <header className="flex justify-center p-4">
        <div className="w-24 h-24 relative">
          <Image
            src="/images/lino_talk.png"
            alt="Logo Lino"
            fill
            className="object-contain"
          />
        </div>
      </header>

      {/* Área de conteúdo principal */}
      <main className="flex-grow flex flex-col px-4 pb-42">
        {/* Caixa de texto com scroll e animação */}
        <div 
          ref={textContainerRef}
          className="bg-white p-4 rounded-lg shadow-md flex-grow overflow-y-auto mb-4 min-h-[200px]"
          style={{ whiteSpace: 'pre-line' }}
        >
          <div className="prose max-w-none">
            <p className="text-gray-700">
              {displayedReviewText}
              {displayedReviewText.length < reviewText.length && (
                <span className="animate-blink">|</span>
              )}
            </p>
          </div>
        </div>

        {/* Opção "Entendi algo errado?" como toggle */}
        {!reviewConcluido && (
          <div className="flex items-center">
            <label htmlFor="needs-response" className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="needs-response" 
                  className="sr-only" 
                  checked={needsResponse}
                  onChange={() => setNeedsResponse(v => !v)}
                />
                <div className={`block w-14 h-8 rounded-full ${needsResponse ? 'bg-secundary' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${needsResponse ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-3 text-md font-medium text-gray-700">
                Entendi algo errado?
              </span>
            </label>
          </div>
        )}
      </main>

      {/* Barra de ações fixa na parte inferior */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        {/* Área de resposta (se necessário) */}
        {needsResponse && (
          <div className="px-4 pt-3 transition-all duration-300">
            {showTextInput ? (
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
              />
            ) : isRecording ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                <span className="text-red-600">Gravando... Clique para parar</span>
              </div>
            ) : audioRecorded ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <span className="text-green-700">
                  Áudio gravado!
                </span>
              </div>
            ) : (
              <div className="p-3 bg-white border border-secundary opacity-30 rounded-lg text-center">
                <span className="text-primary">Clique no microfone para gravar</span>
              </div>
            )}
          </div>
        )}

        {/* Botões de ação */}
        <div className="p-4 flex justify-between items-center">
          {/* Botão de voltar */}
          <Link 
            href="/feedback/record" 
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <FaArrowLeft size={20} />
          </Link>

          {/* Botões de ação condicionais */}
          <div className="flex-grow flex justify-center gap-4">
            {needsResponse && (
              <>
                <button
                  onClick={toggleRecording}
                  className={`p-4 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  <FaMicrophone size={20} />
                </button>
                <button
                  onClick={toggleTextInput}
                  className={`p-4 rounded-full ${showTextInput ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  <FaKeyboard size={20} />
                </button>
              </>
            )}
          </div>

          {/* Botão de enviar ou reload */}
          {needsResponse ? (
            <button
              onClick={handleReload}
              className={`p-4 rounded-full bg-sky-400 hover:bg-sky-500 text-white transition ${
                (!feedbackText.trim() && !audioBlob) || reloadCount >= maxReloads ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={(!feedbackText.trim() && !audioBlob) || reloadCount >= maxReloads}
              title={
                reloadCount >= maxReloads
                  ? "Limite de 5 respostas atingido"
                  : (!feedbackText.trim() && !audioBlob)
                  ? "Grave ou digite uma resposta para habilitar"
                  : ""
              }
            >
              <FaArrowUp size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="p-4 rounded-full bg-green-500 hover:bg-green-600 text-white"
            >
              <FaPaperPlane size={20} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}