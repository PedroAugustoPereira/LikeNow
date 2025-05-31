"use client";

import { useForm } from "react-hook-form";
import React, { useState } from 'react'; 
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaSlack } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import authService from '@/services/auth_service';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, 
  } = useForm<LoginFormData>({
    mode: "onChange", 
    defaultValues: { 
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // 1. Tentativa de login
      let response = await authService.login(data.email, data.password);
      
      // 3. Redirecionar com base no tipo de usuário (exemplo)
      if (data.password != '1234') {
        router.push('/');
      } else {
        router.push('/start/onboarding?userId=' + response.user_id);
      }
      
      // 4. Se "Lembrar de mim" estiver marcado, armazenar email (opcional)
      if (data.rememberMe) {
        localStorage.setItem('rememberedEmail', data.email);
      }
      
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(
        error.response?.data?.message || 
        "Credenciais inválidas. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'slack') => {
    setIsLoading(true);
    try {
      // Implementação do login social (exemplo)
      //let socialResponse;
      if (provider === 'google') {
        // Chamada para API de login com Google
        // socialResponse = await authService.loginWithGoogle();
      } else {
        // Chamada para API de login com Slack
        // socialResponse = await authService.loginWithSlack();
      }
      
      // Redirecionamento após login social
      router.push('/dashboard');
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setLoginError(`Falha no login com ${provider}. Tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseClass = "appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none sm:text-sm";
  const defaultBorderClass = "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  const errorBorderClass = "border-red-500 focus:ring-red-500 focus:border-red-500";

  return (
    <div className="min-h-screen bg-gray-50 font-sans sm:flex sm:items-center sm:justify-center sm:py-12 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full bg-white p-6 space-y-8 min-h-screen flex flex-col justify-center sm:min-h-0 sm:max-w-md sm:p-8 sm:shadow-xl sm:rounded-lg sm:flex-none">
        
        {/* Logo */}
        <div className="flex justify-center">
            <img 
              src="/images/lino.png"
              alt="Logo Lino"
              className="h-40 place-self-center"
            />
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">LINO</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sou seu assistente pessoal de time!
          </p>
        </div>

        {/* Mensagem de erro */}
        {loginError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {loginError}
          </div>
        )}

        {/* Formulário de login */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
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
              <label htmlFor="password" className="sr-only">Senha</label>
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
              <label htmlFor="remember-me" className="ml-2 block text-gray-900">
                Lembrar de mim
              </label>
            </div>

            <div>
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${isValid && !isLoading ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-gray-400 cursor-not-allowed'}
                focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : "Entrar"}
            </button>
          </div>
        </form>

        {/* Divisor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 sm:bg-gray-50">
              Ou continue com
            </span>
          </div>
        </div>

        {/* Botões de login social */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <FcGoogle className="h-5 w-5" />
            <span className="ml-2">Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('slack')}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <FaSlack className="h-5 w-5 text-[#E01E5A]" />
            <span className="ml-2">Slack</span>
          </button>
        </div>
      </div>
    </div>
  );
}