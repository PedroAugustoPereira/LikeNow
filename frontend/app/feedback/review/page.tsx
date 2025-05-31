"use client";

import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaKeyboard, FaArrowLeft, FaPaperPlane, FaArrowUp } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { transcreverAudio } from '../../utils/transcribe';
import { useRouter } from 'next/navigation'; 

export default function ReviewPage() {
  const [needsResponse, setNeedsResponse] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewText, setReviewText] = useState("");
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [reviewConcluido, setReviewConcluido] = useState(false); // NOVO STATE
  const [reloadCount, setReloadCount] = useState(0); // Novo state para contar reloads
  const maxReloads = 5;
  const router = useRouter(); // Inicialize o router


  // Referências para gravação de áudio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ultimoFeedback");
    if (saved != null) {
      try {
        const obj = JSON.parse(saved);
        setReviewText(obj.textoTranscrito || obj.text || "");
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

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Chama a transcrição e coloca o texto no feedbackText
        const texto = await transcreverAudio(audioBlob);
        setFeedbackText(texto || "");
        console.log("Texto transcrito:", texto); // <-- Exibe no console
        audioChunksRef.current = [];
        setAudioRecorded(true); // Marca que já gravou
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
      setAudioRecorded(true); // Marca que já gravou
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

  // Atualizado: agora seta reviewConcluido ao dar reload
  const handleReload = () => {
    if (feedbackText.trim() && reloadCount < maxReloads) {
      setReviewText(prev => prev + (prev ? "\n\n" : "") + feedbackText.trim());
      setFeedbackText("");
      setAudioRecorded(false);
      setShowTextInput(false);
      setReloadCount(count => count + 1);
      if (reloadCount + 1 >= maxReloads) {
        setReviewConcluido(true); // Marca como concluído após 5 reloads
        setNeedsResponse(false);  // Esconde o toggle
      } else {
        setNeedsResponse(false); // Fecha o toggle, mas permite abrir de novo
      }
    }
  }

  const handleSubmit = () => {
    console.log('Feedback enviado:', {
      reviewText,
      responseText: feedbackText,
      needsResponse
    });
    // Lógica para enviar para o backend
    setNeedsResponse(false); // Fecha o toggle, mas permite abrir de novo
    router.push('/feedback/sended');
  };

  return (
    <div className="min-h-screen flex flex-col  bg-gray-50">
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
        {/* Caixa de texto readonly */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-grow overflow-y-auto mb-4">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line text-gray-700">
              {reviewText}
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
                <div className={`block w-14 h-8 rounded-full ${needsResponse ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
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
        {/* Área de resposta (se necessário) - Agora no footer */}
        {needsResponse && (
          <div className="px-4 pt-3 transition-all duration-300">
            {showTextInput ? (
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={2}
              />
            ) : isRecording ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                <span className="text-red-600">Gravando... Clique para parar</span>
              </div>
            ) : audioRecorded ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <span className="text-green-700">
                  Áudio gravado! Clique no microfone para sobrescrever.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <span className="text-orange-600">Clique no microfone para gravar</span>
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
                  className={`p-4 rounded-full ${showTextInput ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
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
                !feedbackText.trim() || reloadCount >= maxReloads ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!feedbackText.trim() || reloadCount >= maxReloads}
              title={
                reloadCount >= maxReloads
                  ? "Limite de 5 respostas atingido"
                  : !feedbackText.trim()
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