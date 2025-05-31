"use client";

import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUser, FaUserSecret } from 'react-icons/fa';
import { FiClock, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import authService from '@/services/auth_service';

// Tipo para os feedbacks
type Feedback = {
  id: string;
  senderName: string;
  isAnonymous: boolean;
  date: string;
  text: string;
  isLeader: boolean; // Indica se foi enviado para o líder
};

export default function FeedbackHistoryPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const [isLeader, setIsLeader] = useState(true); // Simulação - substitua pela lógica real
  
  useEffect(() => {
    authService.checkAuthentication();
  }, []);
  // Simulação de carregamento dos feedbacks
  useEffect(() => {
    // Substitua isso pela chamada real à API
    const loadFeedbacks = async () => {
      // Simulação de dados
      const mockFeedbacks: Feedback[] = [
        {
          id: '1',
          senderName: 'João Silva',
          isAnonymous: false,
          date: '2023-05-15T14:30:00',
          text: 'O projeto está progredindo bem, mas acredito que poderíamos melhorar a comunicação entre as equipes. Durante as reuniões, percebo que nem todos têm a oportunidade de falar e compartilhar suas ideias. Sugiro implementarmos rodadas mais estruturadas onde cada membro tenha um tempo dedicado para contribuir.',
          isLeader: isLeader
        },
        {
          id: '2',
          senderName: 'Anônimo',
          isAnonymous: true,
          date: '2023-05-14T09:15:00',
          text: 'Gostaria de sugerir mais flexibilidade no horário de trabalho. O modelo atual está causando estresse desnecessário na equipe. Com a possibilidade de horários flexíveis ou trabalho remoto em alguns dias da semana, acredito que poderíamos aumentar significativamente a produtividade e o bem-estar geral.',
          isLeader: isLeader
        },
        {
          id: '3',
          senderName: 'Maria Oliveira',
          isAnonymous: false,
          date: '2023-05-10T16:45:00',
          text: 'Adorei a iniciativa do último team building! Foi ótimo para integrar a equipe. Sugiro que façamos atividades assim trimestralmente. Além disso, pense em incluir desafios que incentivem a colaboração entre departamentos diferentes para quebrar as barreiras organizacionais.',
          isLeader: isLeader
        }
      ];

      setFeedbacks(mockFeedbacks);
    };

    loadFeedbacks();
    
    // // Simulação de verificação se é líder - substitua pela lógica real
    // setIsLeader(localStorage.getItem('userRole') === 'leader');
  }, [isLeader]);

  const toggleExpand = (id: string) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

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
              {isLeader ? 'Aqui os feedbacks que recebeu' : 'Aqui está seus feedbacks'}
            </h1>
          </Link>
        </div>
      </header>

      {/* Lista de Feedbacks */}
      <main className="flex-grow container mx-auto p-4">
        {feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Nenhum feedback encontrado</p>
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
                        {feedback.isAnonymous ? 'Anônimo' : feedback.senderName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <FiCalendar className="mr-1" />
                          {formatDate(feedback.date)}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="mr-1" />
                          {formatTime(feedback.date)}
                        </span>
                      </div>
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
                      {feedback.text}
                    </p>
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