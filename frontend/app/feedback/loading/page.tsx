"use client";

import { useState, useEffect } from "react";

export default function Pensando() {
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("isAnonymous");
    if (saved === "true") setIsAnonymous(true);
  }, []);

  return (
    <div
      className={`min-h-screen font-sans flex flex-col items-center justify-center transition-colors duration-300 ${
        isAnonymous ? "dark:bg-gray-900 dark:text-white" : "bg-gray-50 text-gray-700"
      }`}
    >
      <img
        src="/images/lino_think.png"
        alt="Logo Lino"
        className="h-40 mb-8"
      />
      <p className="text-xl text-center mb-8">
        Pensando na melhor resposta para você...
      </p>
    </div>
  );
}