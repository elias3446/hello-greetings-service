import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Shield, FileText, Edit, Clock } from 'lucide-react';
import { HistorialEstadoUsuario } from '@/types/tipos';

interface UserHistoryProps {
  historial: HistorialEstadoUsuario[];
}

export const UserHistory: React.FC<UserHistoryProps> = ({ historial }) => {
  const getIconForAction = (tipoAccion: string) => {
    switch (tipoAccion) {
      case 'creacion':
        return <User className="h-4 w-4" />;
      case 'cambio_estado':
        return <Shield className="h-4 w-4" />;
      case 'cambio_rol':
        return <Shield className="h-4 w-4" />;
      case 'asignacion_reporte':
        return <FileText className="h-4 w-4" />;
      case 'actualizacion':
        return <Edit className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionDescription = (registro: HistorialEstadoUsuario) => {
    switch (registro.tipoAccion) {
      case 'creacion':
        return 'Usuario creado';
      case 'cambio_estado':
        return `Estado cambiado de "${registro.estadoAnterior}" a "${registro.estadoNuevo}"`;
      case 'cambio_rol':
        return `Rol cambiado de "${registro.estadoAnterior}" a "${registro.estadoNuevo}"`;
      case 'asignacion_reporte':
        return 'Reporte asignado';
      case 'actualizacion':
        return 'Información actualizada';
      default:
        return 'Acción realizada';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de estado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historial && historial.length > 0 ? (
            historial.map((registro) => (
              <div key={registro.id} className="flex items-start gap-3">
                <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                  <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getIconForAction(registro.tipoAccion)}
                    <Badge variant="outline" className="capitalize">
                      {registro.tipoAccion.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{getActionDescription(registro)}</p>
                  {registro.motivoCambio && (
                    <p className="text-sm text-muted-foreground">Motivo: {registro.motivoCambio}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {registro.fechaHoraCambio.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>•</span>
                    <span>Por: {registro.realizadoPor.nombre} {registro.realizadoPor.apellido}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No hay registros en el historial
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 