import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartsAndSummaryProps } from '@/props/dashboard/PropDashboardGeneral';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const ChartsAndSummary = ({ 
  reportesPorEstado, 
  reportesActivos, 
  estadisticasPorTipo,
  formatearTipoEstado 
}: ChartsAndSummaryProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Reportes por Estado</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          {reportesPorEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportesPorEstado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {reportesPorEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} reportes`, 'Cantidad']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No hay datos disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Actividad</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p>Reportes activos</p>
                <p className="font-medium">{reportesActivos}</p>
              </div>
              {Object.entries(estadisticasPorTipo).map(([tipo, cantidad]) => (
                <div key={tipo} className="flex items-center justify-between text-sm">
                  <p>Reportes {formatearTipoEstado(tipo)}</p>
                  <p className="font-medium">{cantidad}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsAndSummary; 