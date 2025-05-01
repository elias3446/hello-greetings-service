
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReporteAccionesProps {
  reporteId?: string;
  onMarkInProgress?: () => void;
  onMarkResolved?: () => void;
}

export const ReporteAcciones = ({ 
  reporteId,
  onMarkInProgress, 
  onMarkResolved 
}: ReporteAccionesProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/reportes/${reporteId}/editar`);
  };

  return (
    <div className="flex gap-3">
      {reporteId && (
        <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
          <Edit className="w-4 h-4" /> Edit Report
        </Button>
      )}
      {onMarkInProgress && (
        <Button variant="outline" onClick={onMarkInProgress} className="flex items-center gap-2">
          <Clock className="w-4 h-4" /> Mark In Progress
        </Button>
      )}
      {onMarkResolved && (
        <Button onClick={onMarkResolved} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Check className="w-4 h-4" /> Mark Resolved
        </Button>
      )}
    </div>
  );
};
