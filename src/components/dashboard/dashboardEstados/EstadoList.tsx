import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EstadoListProps } from '@/props/dashboard/PropDashboardEstados';

const EstadoList: React.FC<EstadoListProps> = ({ 
  estados, 
  reportesPorEstado, 
  reportesPorTipoEstado,
  reportes 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Estados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {estados.map((estado) => {
            const reportesCount = reportesPorEstado.find(r => r.name === estado.nombre)?.value || 0;
            const metricas = reportesPorTipoEstado.find(r => r.name === estado.nombre);
            const reportesDelEstado = reportes.filter(reporte => reporte.estado.id === estado.id);
            
            return (
              <div 
                key={estado.id} 
                className="p-4 rounded-lg border"
                style={{ borderColor: estado.color }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: estado.color }}
                    ></div>
                    <div>
                      <span className="font-medium text-lg">{estado.nombre}</span>
                      <p className="text-sm text-muted-foreground">{estado.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <p className="text-xl font-bold">{reportesCount}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">Sin Resolver</span>
                      <p className="text-xl font-bold text-red-500">{metricas?.sinResolver || 0}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">Resueltos</span>
                      <p className="text-xl font-bold text-green-500">{metricas?.resueltos || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Lista de reportes */}
                <div className="mt-4 space-y-2">
                  {reportesDelEstado.map(reporte => (
                    <div 
                      key={reporte.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-2 h-2 rounded-full ${reporte.activo ? 'bg-red-500' : 'bg-green-500'}`}
                        />
                        <div>
                          <p className="font-medium">{reporte.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            Categoría: {reporte.categoria?.nombre || 'Sin categoría'} | 
                            Prioridad: {reporte.prioridad?.nombre || 'Sin prioridad'} | 
                            Fecha: {new Date(reporte.fechaCreacion).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reporte.activo 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {reporte.activo ? 'Sin Resolver' : 'Resuelto'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EstadoList; 