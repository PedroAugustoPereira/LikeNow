import React, { Suspense } from 'react';
import OnboardingForm from "./OnboardingForm";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <OnboardingForm/>
    </Suspense>
  )
}