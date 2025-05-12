import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { actividadesReporte } from '@/data/actividades';
import { getActividadesReporte } from '@/controller/CRUD/actividadReporteController';
import { usuarios } from '@/data/usuarios';
import type { Reporte } from '@/types/tipos';
import { CircleDot } from 'lucide-react';

export interface ReporteActividadProps {
  reporte: Reporte;
}

export const ReporteActividad = ({ reporte }: ReporteActividadProps) => {
  // Obtener actividades tanto de los datos estáticos como del controlador
  const actividadesEstaticas = actividadesReporte.filter(actividad => actividad.reporteId === reporte.id);
  const actividadesDinamicas = getActividadesReporte(reporte.id);
  
  // Combinar y ordenar todas las actividades por fecha
  const todasLasActividades = [...actividadesEstaticas, ...actividadesDinamicas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad del Reporte</CardTitle>
      </CardHeader>
      <CardContent>
        {todasLasActividades.length > 0 ? (
          <div className="space-y-4">
            {todasLasActividades.map((actividad) => {
              // Buscar el usuario correspondiente por usuarioId
              const usuario = usuarios.find(u => u.id === actividad.usuarioId);
              
              return (
                <div key={actividad.id} className="border-l-2 border-green-500 pl-4 ml-2">
                  <div className="flex items-start gap-2">
                    <CircleDot className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium">{actividad.descripcion}</p>
                      <p className="text-sm text-gray-500">
                        Por {usuario?.nombre} {usuario?.apellido}
                      </p>
                      <p className="text-sm text-gray-500">
                        {actividad.fecha.toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {actividad.detalles?.comentario && (
                        <p className="mt-2 text-gray-600 bg-gray-50 p-2 rounded-md">
                          {actividad.detalles.comentario}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No hay actividad registrada para este reporte.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReporteActividad;
