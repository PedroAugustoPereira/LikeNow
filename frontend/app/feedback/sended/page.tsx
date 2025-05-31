"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import authService from '@/services/auth_service';

export default function SendedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 animate-fade-in">
      {/* Logo centralizado */}
      <div className="w-40 h-40 relative mb-8">
        <Image
          src="/images/lino_ok.png"
          alt="Logo Lino"
          fill
          className="object-contain"
        />
      </div>

      {/* Mensagem de confirmação */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Lino enviou seu feedback!</h1>
        <p className="text-gray-500 mt-2">Valeu por contribuir!</p>
      </div>

      {/* Botão para voltar */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/feedback/record"
          className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full hover:bg-secundary transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Falar com Lino novamente
        </Link>

        {/* Novo botão para home */}
        <Link
          href="/"
          className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
        >
          <FaHome className="mr-2" />
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}