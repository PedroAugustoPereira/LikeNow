"use client";

import { useForm } from "react-hook-form";
import React from 'react'; 
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaSlack } from "react-icons/fa";

type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean; // Adicionado para o checkbox "Lembrar de mim"
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }, 
  } = useForm<LoginFormData>({
    mode: "onChange", 
    defaultValues: { 
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // Substituir por chamada à API de login
    console.log("Login attempt with data:", data);
  };

  // --- Lógica para classes de input dinâmicas ---
  const inputBaseClass =
    "appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none sm:text-sm";
  
  const defaultBorderClass =
    "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  const errorBorderClass =
    "border-red-500 focus:ring-red-500 focus:border-red-500";


  return (
    // Container principal da página
    // Mobile: min-h-screen bg-gray-50 font-sans (sem padding, sem flex centering)
    // SM+: Adiciona flex centering e padding para o painel
    <div className="min-h-screen bg-gray-50 font-sans sm:flex sm:items-center sm:justify-center sm:py-12 sm:px-4 md:px-6 lg:px-8">
      {/* Painel do formulário 
        Mobile: w-full, min-h-screen, p-6, bg-white, flex flex-col justify-center (para centralizar conteúdo verticalmente)
                Sem sombra, sem bordas arredondadas.
        SM+: sm:max-w-md, sm:min-h-0 (altura auto), sm:p-8, sm:shadow-xl sm:rounded-lg, sm:flex-none (reseta flex)
      */}
      <div className="w-full bg-white p-6 space-y-8 min-h-screen flex flex-col justify-center sm:min-h-0 sm:max-w-md sm:p-8 sm:shadow-xl sm:rounded-lg sm:flex-none">
        
        {/* Logo - Centralizado no painel */}
        <div className="flex justify-center">
            <img 
              src="/images/lino_icon.png"
              alt="Logo Lino"
              className="h-40 place-self-center"
            />
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            LINO
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sou seu assistente pessoal de time!
          </p>
        </div>

        {/* Formulário de login */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`${inputBaseClass} ${
                  errors.email ? errorBorderClass : defaultBorderClass
                }`}
                placeholder="Email"
                {...register("email", {
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Endereço de email inválido"
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Input Senha */}
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`${inputBaseClass} ${
                  errors.password ? errorBorderClass : defaultBorderClass
                }`}
                placeholder="Senha"
                {...register("password", { 
                  required: "Senha é obrigatória" 
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register("rememberMe")}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-gray-900"
              >
                Lembrar de mim
              </label>
            </div>

            <div>
              <Link
                href="#" // Substituir pelo link real de "esqueci a senha"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isValid || isSubmitting} 
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${isValid && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-gray-400 cursor-not-allowed'}
                 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        {/* Divisor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 sm:bg-gray-50"> {/* Ajuste de cor de fundo do divisor para mobile */}
              Ou continue com
            </span>
          </div>
        </div>

        {/* Botões de login social */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button" // Adicionado type="button" para evitar submit do formulário principal
            onClick={() => console.log("Login com Google")} 
            className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FcGoogle className="h-5 w-5" />
            <span className="ml-2">Google</span>
          </button>

          <button
            type="button" // Adicionado type="button"
            onClick={() => console.log("Login com Slack")} 
            className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaSlack className="h-5 w-5 text-[#E01E5A]" /> {/* Cor do Slack pode ser ajustada se necessário */}
            <span className="ml-2">Slack</span>
          </button>
        </div>
      </div>
    </div>
  );
}
