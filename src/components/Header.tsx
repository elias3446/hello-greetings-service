
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  toggleLanguage: () => void;
  currentLanguage: 'es' | 'en';
}

const Header: React.FC<HeaderProps> = ({ toggleLanguage, currentLanguage }) => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-gradient-to-r from-espanol-red to-espanol-orange text-white">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">¡Hola Mundo!</h1>
        <Badge className="bg-espanol-yellow text-black hover:bg-espanol-gold">Beta</Badge>
      </div>
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-transparent border-white text-white hover:bg-white/20"
          onClick={toggleLanguage}
        >
          {currentLanguage === 'es' ? 'English' : 'Español'}
        </Button>
      </div>
    </header>
  );
};

export default Header;
