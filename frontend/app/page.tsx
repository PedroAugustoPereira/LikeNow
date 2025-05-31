"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FaMicrophone, FaHistory } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Logo centralizado */}
      <div className="w-48 h-48 relative mb-10">
        <Image
          src="/images/lino_icon.png"
          alt="Logo Lino"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Olá, eu sou o Lino!</h1>
      <p className="text-gray-600 mb-10">Seu assistente de feedback</p>

      {/* Botões de ação */}
      <div className="w-full max-w-md space-y-4">
        {/* Botão para falar com Lino */}
        <Link
          href="/feedback/record"
          className="flex items-center justify-center px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-md"
        >
          <FaMicrophone className="mr-3 text-xl" />
          <span className="text-lg">Falar com Lino</span>
        </Link>

        {/* Botão para histórico */}
        <Link
          href="/feedback/history"
          className="flex items-center justify-center px-6 py-4 bg-white text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors shadow-md"
        >
          <FaHistory className="mr-3 text-xl" />
          <span className="text-lg">Histórico de Feedbacks</span>
        </Link>
      </div>
    </div>
  );
}