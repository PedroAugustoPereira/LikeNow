"use client";

import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUser, FaUserSecret } from 'react-icons/fa';
import { FiClock, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import authService from '@/services/auth_service';
import feedbackService, { Feedback } from '@/services/feedback_service';
import userService from '@/services/user_service';
import teamService from '@/services/team_service';

export default function FeedbackHistoryPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService.checkAuthentication();
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      // Verifica se o usuário é líder
      const user = await userService.getUserById(userId);
      if (user.team_id) {
        const team = await teamService.getTeamById(user.team_id);
        setIsLeader(team.leaderId === userId);
      }

      // Carrega os feedbacks apropriados
      await loadFeedbacks(userId);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar histórico de feedbacks');
    } finally {
      setLoading(false);
    }
  }

  async function loadFeedbacks(userId: string) {
    try {
      let feedbacksData: Feedback[] = [];
      
      if (isLeader) {
        // Se for líder, busca feedbacks recebidos
        feedbacksData = await feedbackService.getReceivedFeedbacks(userId);
      } else {
        // Se não for líder, busca feedbacks enviados
        feedbacksData = await feedbackService.getSentFeedbacks(userId);
      }

      // Enriquece os dados com nomes dos remetentes (quando não anônimo)
      const enrichedFeedbacks = await Promise.all(
        feedbacksData.map(async (feedback) => {
          if (!feedback.isAnonymous && feedback.senderUserId) {
            try {
              const sender = await userService.getUserById(feedback.senderUserId);
              return { ...feedback, senderName: sender.name };
            } catch (err) {
              console.error('Erro ao buscar remetente:', err);
              return feedback;
            }
          }
          return feedback;
        })
      );

      setFeedbacks(enrichedFeedbacks);
    } catch (err) {
      console.error('Erro ao carregar feedbacks:', err);
      throw err;
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 relative mb-4">
          <Image
            src="/images/lino.png"
            alt="Logo Lino"
            fill
            className="object-contain animate-pulse"
          />
        </div>
        <p className="text-gray-500">Carregando histórico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-16 h-16 relative mb-4">
          <Image
            src="/images/lino.png"
            alt="Logo Lino"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchUserData}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 relative mr-2">
              <Image
                src="/images/lino.png"
                alt="Logo Lino"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-lg font-bold text-gray-500">
              {isLeader ? 'Feedbacks recebidos do seu time' : 'Seus feedbacks enviados'}
            </h1>
          </Link>
        </div>
      </header>

      {/* Lista de Feedbacks */}
      <main className="flex-grow container mx-auto p-4">
        {feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-lg">
              {isLeader ? 'Nenhum feedback recebido ainda' : 'Você ainda não enviou nenhum feedback'}
            </p>
            <Link 
              href={isLeader ? "/" : "/feedback/record"} 
              className="mt-4 text-primary hover:underline"
            >
              {isLeader ? 'Voltar para home' : 'Enviar um feedback'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div 
                key={feedback.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                  expandedFeedback === feedback.id ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div 
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpand(feedback.id)}
                >
                  <div className="flex items-center space-x-3">
                    {feedback.isAnonymous ? (
                      <FaUserSecret className="text-gray-400 text-xl" />
                    ) : (
                      <FaUser className="text-primary text-xl" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-400">
                        {feedback.isAnonymous ? 'Anônimo' : feedback.senderName || 'Remetente desconhecido'}
                      </h3>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expandedFeedback === feedback.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </div>

                {/* Conteúdo expandido */}
                <div 
                  className={`px-4 pb-4 transition-all duration-300 ${
                    expandedFeedback === feedback.id ? 'block' : 'hidden'
                  }`}
                >
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {feedback.message}
                    </p>
                    {isLeader && !feedback.isAnonymous && feedback.senderUserId && (
                      <div className="mt-2 text-sm text-gray-500">
                        Enviado por: {feedback.senderName || 'Usuário ID: ' + feedback.senderUserId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}