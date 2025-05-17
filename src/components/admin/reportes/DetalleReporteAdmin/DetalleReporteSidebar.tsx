import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, CheckCircle, AlertTriangle, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Reporte, HistorialEstadoReporte } from '@/types/tipos';

interface DetalleReporteSidebarProps {
  reporte: Reporte;
  historialEstados: HistorialEstadoReporte[];
  onEdit: () => void;
  onMarkResolved: () => void;
  onReassign: () => void;
  onDelete: () => void;
}

const DetalleReporteSidebar: React.FC<DetalleReporteSidebarProps> = ({
  reporte,
  historialEstados,
  onEdit,
  onMarkResolved,
  onReassign,
  onDelete
}) => (
  <div className="space-y-6">
    {/* Tarjeta de acciones rápidas */}
    <Card>
      <CardHeader>
        <CardTitle>Acciones rápidas</CardTitle>
        <CardDescription>Opciones para gestionar este reporte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start" disabled={!reporte.activo} onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar reporte
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onMarkResolved}>
          {reporte.activo ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Marcar como resuelto
            </>
          ) : (
            <>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Reabrir
            </>
          )}
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onReassign} disabled={!reporte.activo}>
          <User className="mr-2 h-4 w-4" />
          Reasignar
        </Button>
        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={onDelete}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          Eliminar reporte
        </Button>
      </CardContent>
    </Card>
    {/* Tarjeta de documentos adjuntos */}
    <Card>
      <CardHeader>
        <CardTitle>Documentos adjuntos</CardTitle>
      </CardHeader>
      <CardContent>
        {reporte.imagenes && reporte.imagenes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Imágenes</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {reporte.imagenes.map((imagen, idx) => (
                <div key={idx} className="aspect-square rounded-md overflow-hidden border">
                  <img src={imagen} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    {/* Tarjeta de historial */}
    <Card>
      <CardHeader>
        <CardTitle>Historial de estados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historialEstados && historialEstados.length > 0 ? (
            historialEstados.map((registro) => (
              <div key={registro.id} className="flex items-start gap-3">
                <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                  <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {registro.tipoAccion.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{registro.estadoNuevo ? `Estado cambiado a "${registro.estadoNuevo}"` : 'Acción realizada'}</p>
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
  </div>
);

export default DetalleReporteSidebar; 