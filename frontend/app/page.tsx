"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FaMicrophone, FaHistory } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function HomePage() {
  // Mock: forçar como se o usuário fosse líder
  const [isLeader, setIsLeader] = useState(true);
  const [summary, setSummary] = useState('Seu time recebeu 5 feedbacks esta semana: 3 positivos e 2 sugestões.');

  /*
  // Fluxo real (descomentar quando tiver API)
  useEffect(() => {
    async function fetchUserData() {
      const res = await fetch('/api/user');
      const data = await res.json();
      setIsLeader(data.isLeader);

      if (data.isLeader) {
        const summaryRes = await fetch('/api/feedback/summary');
        const summaryData = await summaryRes.json();
        setSummary(summaryData.text);
      }
    }

    fetchUserData();
  }, []);
  */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
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
