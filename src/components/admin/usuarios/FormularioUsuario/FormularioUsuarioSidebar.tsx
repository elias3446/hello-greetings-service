import React from 'react';
import { InfoCard, TipsCard } from '@/components/forms/UserFormCards';

const FormularioUsuarioSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      <InfoCard />
      <TipsCard />
    </div>
  );
};

export default FormularioUsuarioSidebar; 