
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { CategoriaEstadoData, TipoEstado, CHART_COLORS } from '@/utils/dashboardUtils';

interface CategoriasBarChartProps {
  reportesPorCategoriaEstado: CategoriaEstadoData[];
  tiposEstado: TipoEstado;
}

const CategoriasBarChart = ({ reportesPorCategoriaEstado, tiposEstado }: CategoriasBarChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Reportes por Categoría</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {reportesPorCategoriaEstado.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reportesPorCategoriaEstado}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 40,
              }}
              barGap={0}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                interval={0}
              />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [`${value} reportes`, '']} />
              <Legend />
              {Object.keys(tiposEstado).map((tipo, index) => (
                <Bar 
                  key={tipo}
                  dataKey={tiposEstado[tipo].nombre} 
                  name={tiposEstado[tipo].nombre} 
                  fill={tiposEstado[tipo].color || CHART_COLORS[index % CHART_COLORS.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No hay datos disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoriasBarChart;
