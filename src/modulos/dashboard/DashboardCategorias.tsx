import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategories } from '@/controller/CRUD/categoryController';
import { getReports } from '@/controller/CRUD/reportController';
import { getEstados } from '@/controller/CRUD/estadoController';
import { Categoria, EstadoReporte } from '@/types/tipos';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { List } from 'lucide-react';
import { FileText, CheckCircle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Define interfaz para estados agrupados
interface EstadoAgrupado {
  [key: string]: number;
}

const DashboardCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [reportesPorCategoria, setReportesPorCategoria] = useState<any[]>([]);
  const [categoriasMasUsadas, setCategoriasMasUsadas] = useState<any[]>([]);
  const [reportesPorCategoriaEstado, setReportesPorCategoriaEstado] = useState<any[]>([]);
  const [tiposEstado, setTiposEstado] = useState<{[key: string]: {nombre: string, color: string}}>({});
  
  useEffect(() => {
    const categoriasData = getCategories();
    const reportesData = getReports();
    const estadosData = getEstados();
    
    setCategorias(categoriasData);

    // Obtener todos los tipos de estados únicos y sus colores
    const tiposEstadoTemp: {[key: string]: {nombre: string, color: string}} = {};
    estadosData.forEach(estado => {
      if (!tiposEstadoTemp[estado.tipo]) {
        tiposEstadoTemp[estado.tipo] = {
          nombre: estado.nombre,
          color: estado.color
        };
      }
    });
    setTiposEstado(tiposEstadoTemp);

    // Reportes por categoría (incluyendo sin categoría)
    const reportesPorCat = [
      // Reportes sin categoría
      {
        name: 'Sin categoría',
        value: reportesData.filter(reporte => !reporte.categoria).length,
        color: '#808080' // Color gris para sin categoría
      },
      // Reportes por categoría normal
      ...categoriasData.map(categoria => {
        const reportesCat = reportesData.filter(reporte => reporte.categoria && reporte.categoria.id === categoria.id);
        
        return {
          name: categoria.nombre,
          value: reportesCat.length,
          color: categoria.color
        };
      })
    ].sort((a, b) => b.value - a.value);

    setReportesPorCategoria(reportesPorCat);

    // Las 5 categorías más usadas (incluyendo sin categoría si aplica)
    setCategoriasMasUsadas(reportesPorCat.slice(0, 5));

    // Reportes por categoría y estado (incluyendo sin categoría)
    const reportesPorCategoriaEstadoTemp = [
      // Reportes sin categoría
      {
        name: 'Sin categoría',
        color: '#808080',
        ...Object.fromEntries(
          Object.keys(tiposEstadoTemp).map(tipo => [
            tiposEstadoTemp[tipo].nombre,
            reportesData.filter(reporte => 
              !reporte.categoria && 
              tiposEstadoTemp[reporte.estado.tipo]?.nombre === tiposEstadoTemp[tipo].nombre
            ).length
          ])
        )
      },
      // Reportes por categoría normal
      ...categoriasData
        .filter(categoria => 
          reportesData.some(reporte => reporte.categoria && reporte.categoria.id === categoria.id)
        )
        .map(categoria => {
          const reportesCat = reportesData.filter(reporte => reporte.categoria && reporte.categoria.id === categoria.id);
          
          // Crear un objeto para contabilizar por cada tipo de estado
          const estadosConteo: EstadoAgrupado = {};
          
          // Inicializar todos los tipos de estado en 0
          Object.keys(tiposEstadoTemp).forEach(tipo => {
            estadosConteo[tiposEstadoTemp[tipo].nombre] = 0;
          });
          
          // Contar reportes por cada tipo de estado para esta categoría
          reportesCat.forEach(reporte => {
            const estadoNombre = tiposEstadoTemp[reporte.estado.tipo]?.nombre || reporte.estado.nombre;
            estadosConteo[estadoNombre] = (estadosConteo[estadoNombre] || 0) + 1;
          });

          return {
            name: categoria.nombre,
            ...estadosConteo,
            color: categoria.color
          };
        })
    ]
    .sort((a, b) => {
      // Calcular total de reportes por categoría para ordenamiento
      const totalA = Object.keys(a)
        .filter(key => key !== 'name' && key !== 'color')
        .reduce((sum, key) => sum + a[key], 0);
        
      const totalB = Object.keys(b)
        .filter(key => key !== 'name' && key !== 'color')
        .reduce((sum, key) => sum + b[key], 0);
        
      return totalB - totalA;
    })
    .slice(0, 5);

    setReportesPorCategoriaEstado(reportesPorCategoriaEstadoTemp);

  }, []);

  // Función para obtener colores dinámicos para las barras
  const getBarColors = () => {
    const colores: string[] = [];
    if (tiposEstado) {
      Object.values(tiposEstado).forEach(estado => {
        colores.push(estado.color);
      });
    }
    return colores.length > 0 ? colores : ['#10b981', '#f59e0b'];
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de categorías */}
      <Card className="border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
        <CardContent className="flex justify-between items-center py-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Categorías</p>
            <p className="text-3xl font-bold">{categorias.length}</p>
          </div>
          <List className="h-8 w-8 text-[#f59e0b]" />
        </CardContent>
      </Card>

      {/* Gráficos de categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reportes por Categoría</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            {reportesPorCategoria.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportesPorCategoria}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {reportesPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
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
                      fill={tiposEstado[tipo].color || COLORS[index % COLORS.length]} 
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
      </div>

      {/* Lista de categorías más usadas */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías Más Utilizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoriasMasUsadas.map((categoria) => (
              <div 
                key={categoria.name} 
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: `${categoria.color}10` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: categoria.color }}
                  ></div>
                  <span className="font-medium">{categoria.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{categoria.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCategorias;
