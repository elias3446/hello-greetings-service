
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeProps {
  language: 'es' | 'en';
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ language, onStart }) => {
  const content = {
    es: {
      title: "¡Bienvenido a tu aventura en español!",
      subtitle: "Aprende español de forma divertida e interactiva",
      description: "Comienza tu viaje aprendiendo saludos básicos y frases útiles.",
      button: "Comenzar Ahora"
    },
    en: {
      title: "Welcome to your Spanish adventure!",
      subtitle: "Learn Spanish in a fun and interactive way",
      description: "Begin your journey by learning basic greetings and useful phrases.",
      button: "Start Now"
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-espanol-red to-espanol-orange bg-clip-text text-transparent">
        {content[language].title}
      </h1>
      <h2 className="text-xl text-muted-foreground mb-6">{content[language].subtitle}</h2>
      
      <div className="max-w-md mb-8">
        <p>{content[language].description}</p>
      </div>
      
      <Button 
        size="lg" 
        className="bg-espanol-orange hover:bg-espanol-red animate-bounce-slight"
        onClick={onStart}
      >
        {content[language].button}
      </Button>
    </div>
  );
};

export default Welcome;
