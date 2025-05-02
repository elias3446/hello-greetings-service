
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Reporte } from '@/types/tipos';

interface RecentReportsTableProps {
  reportesRecientes: Reporte[];
}

const RecentReportsTable = ({ reportesRecientes }: RecentReportsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3">Título</th>
                <th className="text-left px-4 py-3">Categoría</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reportesRecientes.map((reporte) => (
                <tr key={reporte.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{reporte.titulo}</td>
                  <td className="px-4 py-3">{reporte.categoria.nombre}</td>
                  <td className="px-4 py-3">
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs" 
                      style={{ 
                        backgroundColor: `${reporte.estado.color}20`, 
                        color: reporte.estado.color
                      }}
                    >
                      {reporte.estado.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReportsTable;
