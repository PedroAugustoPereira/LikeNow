"use client";

import { useForm } from "react-hook-form";
import React from 'react'; 

type OnboardingFormData = {
  password: string;
  confirmPassword: string;
};

export default function OnboardingPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting }, 
  } = useForm<OnboardingFormData>({
    mode: "onChange", 
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

  const onSubmit = (data: OnboardingFormData) => {
    // Substituir por chamada à API
    console.log("Formulário enviado com sucesso:", data);
    // Potencialmente resetar o formulário ou navegar o utilizador
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

  return (
    // Container principal da página
    // Mobile: min-h-screen bg-gray-50 font-sans (sem padding, sem flex centering)
    // SM+: Adiciona flex centering e padding para o painel
    <div className="min-h-screen bg-gray-50 font-sans sm:flex sm:items-center sm:justify-center sm:py-12 sm:px-4 md:px-6 lg:px-8">
      {/* Painel do formulário 
        Mobile: w-full, min-h-screen, p-6, bg-white, flex flex-col justify-center (para centralizar conteúdo verticalmente)
                Sem sombra, sem bordas arredondadas.
        SM+: sm:max-w-md, sm:min-h-0 (altura auto), sm:p-8, sm:shadow-xl, sm:rounded-lg, sm:flex-none (reseta flex)
      */}
      <div className="w-full bg-white p-6 space-y-8 min-h-screen flex flex-col justify-center sm:min-h-0 sm:max-w-md sm:p-8 sm:shadow-xl sm:rounded-lg sm:flex-none">
        
      <img 
            src="/images/lino_think.png"
            alt="Logo Lino"
            className="h-40 place-self-center"/>
            <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bem-vindo, fulano!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete seu cadastro para continuar
          </p>
        </div>

        {/* Formulário: Removido mt-8 pois o space-y-8 do painel pai já trata o espaçamento */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Input Senha */}
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

            {/* Input Confirmar Senha */}
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
              disabled={!isValid || isSubmitting} 
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${isValid && !isSubmitting ? 'bg-primary hover:bg-secundary focus:ring-primary cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}
                 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {isSubmitting ? "Enviando..." : "Concluir cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
