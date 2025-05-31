"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FaMicrophone, FaHistory, FaDoorOpen } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import userService from '../services/user_service';
import teamService from '../services/team_service';
import authService from '../services/auth_service';
import { Button } from 'flowbite-react';

export default function HomePage() {
  const [isLeader, setIsLeader] = useState(false);
  const [summary, setSummary] = useState('Carregando...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Verifica se o usuário está autenticado
        authService.checkAuthentication();
        
        // Obtém o user_id do localStorage
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('ID do usuário não encontrado');
        }

        // Busca os dados do usuário
        const user = await userService.getUserById(userId);
        
        // Se o usuário não tem time, não é líder
        if (!user.team_id) {
          setIsLeader(false);
          setSummary('Você não está associado a nenhum time.');
          return;
        }

        // Busca os dados do time
        const team = await teamService.getTeamById(user.team_id);
        
        // Verifica se o usuário é o líder do time
        const userIsLeader = team.leaderId === userId;
        setIsLeader(userIsLeader);

        setSummary('Seu assistente de feedback está pronto para ajudar!');

      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do usuário. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-48 h-48 relative mb-10">
          <Image
            src="/images/lino.png"
            alt="Logo Lino"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-48 h-48 relative mb-10">
          <Image
            src="/images/lino.png"
            alt="Logo Lino"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <header className="flex justify-between items-right p-4">
       
        {/* Ícone Home */}
        <Button onClick={() => authService.logout()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <FaDoorOpen className="text-4xl" />
        </Button>
      </header>
      {/* Logo centralizado */}
      <div className="w-48 h-48 relative mb-10">
        <Image
          src="/images/lino.png"
          alt="Logo Lino"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Olá, eu sou o Lino!</h1>

      {/* Subtítulo: muda se for líder */}
      {!isLeader ? (
        <p className="text-gray-600 mb-10">Seu assistente de feedback</p>
      ) : (
        <p className="text-gray-600 text-center max-w-md mb-10">{summary}</p>
      )}

      {/* Botões */}
      <div className="w-full max-w-md space-y-4">
        {!isLeader && (
          <Link
            href="/feedback/record"
            className="flex items-center justify-center px-6 py-4 bg-primary text-white rounded-full hover:bg-secondary transition-colors shadow-md"
          >
            <FaMicrophone className="mr-3 text-xl" />
            <span className="text-lg">Falar com Lino</span>
          </Link>
        )}

        <Link
          href="/history"
          className="flex items-center justify-center px-6 py-4 bg-white text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors shadow-md"
        >
          <FaHistory className="mr-3 text-xl" />
          <span className="text-lg">
            {isLeader ? 'Ver feedbacks do seu time' : 'Histórico de Feedbacks'}
          </span>
        </Link>
      </div>
    </div>
  );
}