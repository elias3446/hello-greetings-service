
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, MapPin } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
      <h1 className="text-3xl font-bold mb-2">Plataforma de Gestión de Reportes Georreferenciados</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Sistema para el mejoramiento, seguimiento y control de reportes basado en geolocalización
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg" className="gap-2">
          <Link to="/reportes/nuevo">
            <FileText className="h-5 w-5" />
            Crear Nuevo Reporte
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link to="/mapa">
            <MapPin className="h-5 w-5" />
            Ver Mapa de Reportes
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
