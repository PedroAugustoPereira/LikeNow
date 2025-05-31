import { FC } from 'react';

interface LoadingAnimationProps {
  isSaving?: boolean;
  isAnonymous?: boolean;
}

const LoadingAnimation: FC<LoadingAnimationProps> = ({ isSaving = false, isAnonymous = false }) => {
  return (
    <div className={`min-h-screen font-sans flex flex-col items-center justify-center transition-colors duration-300 ${
      isAnonymous ? "dark:bg-gray-900 dark:text-white" : "bg-gray-50 text-gray-700"
    }`}>
      {/* Container da animação */}
      <div className="relative h-40 w-40 mb-8">
        {/* Logo principal com leve animação de pulsação */}
        <img
          src={isAnonymous ? "/images/lino_anom_think.png" : "/images/lino_think.png"}
          alt="Logo Lino"
          className="h-full w-full object-contain animate-pulse"
        />
        
        {/* Pontos de carga giratórios */}
        <div className="absolute -top-2 -right-2 h-8 w-8">
          <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
            isAnonymous ? "border-primary-light" : "border-primary"
          }`}></div>
        </div>
        <div className="absolute -bottom-2 -left-2 h-8 w-8">
          <div className={`animate-spin rounded-full h-6 w-6 border-t-2 ${
            isAnonymous ? "border-primary-light" : "border-primary"
          }`}></div>
        </div>
      </div>

      {/* Texto com animação de pontos variáveis */}
      <p className="text-xl text-center mb-8 flex items-center">
        {isSaving ? "Enviando seu feedback" : "Pensando na melhor resposta para você"}
        <span className="loading-dots">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-100">.</span>
          <span className="animate-bounce delay-200">.</span>
        </span>
      </p>

      {/* Barra de progresso sutil */}
      <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className={`h-2 rounded-full animate-progress ${
          isAnonymous ? "bg-primary-light" : "bg-primary"
        }`}></div>
      </div>

      {isSaving && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Isso pode levar alguns instantes...
        </div>
      )}
    </div>
  );
};

export default LoadingAnimation;