"use client";

import { useForm } from "react-hook-form";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import userService from '@/services/user_service';

type OnboardingFormData = {
  password: string;
  confirmPassword: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('usuário');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }, 
  } = useForm<OnboardingFormData>({
    mode: "onChange", 
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Obter userId da URL (caso venha de convite por email)
  useEffect(() => {
    const id = searchParams.get('userId');
    if (id) {
      setUserId(id);
      // Opcional: buscar nome do usuário para personalizar a mensagem
      fetchUserName(id);
    }
  }, [searchParams]);

  const fetchUserName = async (id: string) => {
    try {
      const user = await userService.getUserById(id);
      setUserName(user.name || 'usuário');
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
    }
  };

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

  const onSubmit = async (data: OnboardingFormData) => {
    if (!userId) {
      setError('ID do usuário não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Chamar o serviço para atualizar a senha
      await userService.changePassword(userId, {
        password: data.password
      });

      // Sucesso - redirecionar ou mostrar mensagem
      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error('Erro ao atualizar senha:', err);
      setError(
        err.response?.data?.message || 
        'Erro ao atualizar senha. Por favor, tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Lógica para classes de input dinâmicas ---
  const inputBaseClass =
    "appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none sm:text-sm";
  
  const defaultBorderClass =
    "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  const errorBorderClass =
    "border-red-500 focus:ring-red-500 focus:border-red-500";
  const successBorderClass =
    "border-green-500 focus:ring-green-500 focus:border-green-500";

  const passwordsMatchAndAreValid =
    watchedPassword &&
    watchedPassword.length >= 6 &&
    watchedConfirmPassword && 
    watchedPassword === watchedConfirmPassword &&
    !errors.password && 
    !errors.confirmPassword; 

  let passwordInputFinalClass = `${inputBaseClass} `;
  if (errors.password) {
    passwordInputFinalClass += errorBorderClass;
  } else if (errors.confirmPassword && errors.confirmPassword.type === "validate") {
    passwordInputFinalClass += errorBorderClass;
  } else if (passwordsMatchAndAreValid) {
    passwordInputFinalClass += successBorderClass;
  } else {
    passwordInputFinalClass += defaultBorderClass;
  }

  let confirmPasswordInputFinalClass = `${inputBaseClass} `;
  if (errors.confirmPassword) {
    confirmPasswordInputFinalClass += errorBorderClass;
  } else if (passwordsMatchAndAreValid) {
    confirmPasswordInputFinalClass += successBorderClass;
  } else {
    confirmPasswordInputFinalClass += defaultBorderClass;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans sm:flex sm:items-center sm:justify-center sm:py-12 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full bg-white p-6 space-y-8 min-h-screen flex flex-col justify-center sm:min-h-0 sm:max-w-md sm:p-8 sm:shadow-xl sm:rounded-lg sm:flex-none">
          <img 
            src="/images/lino_think.png"
            alt="Logo Lino"
            className="h-40 place-self-center"
          />
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Cadastro concluído!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Redirecionando para o dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans sm:flex sm:items-center sm:justify-center sm:py-12 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full bg-white p-6 space-y-8 min-h-screen flex flex-col justify-center sm:min-h-0 sm:max-w-md sm:p-8 sm:shadow-xl sm:rounded-lg sm:flex-none">
        <img 
          src="/images/lino_think.png"
          alt="Logo Lino"
          className="h-40 place-self-center"
        />
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bem-vindo, {userName}!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete seu cadastro para continuar
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Nova senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={passwordInputFinalClass}
                placeholder="Nova senha"
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={confirmPasswordInputFinalClass}
                placeholder="Confirmar senha"
                {...register("confirmPassword", {
                  required: "Confirmação de senha é obrigatória",
                  validate: (value) =>
                    value === watchedPassword || "As senhas não coincidem",
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isValid || isLoading || !userId}
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
                  Processando...
                </span>
              ) : "Concluir cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}