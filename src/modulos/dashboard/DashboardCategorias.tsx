import { useEffect, useState } from 'react';
import { getCategories } from '@/controller/CRUD/category/categoryController';
import { obtenerReportes } from '@/controller/CRUD/report/reportController';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import { Categoria } from '@/types/tipos';
import { ChartData } from '@/props/dashboard/PropDashboardCategorias';
import CategoryTotalCard from '@/components/dashboard/dashboardCategorias/CategoryTotalCard';
import CategoryCharts from '@/components/dashboard/dashboardCategorias/CategoryCharts';
import MostUsedCategories from '@/components/dashboard/dashboardCategorias/MostUsedCategories';

const DashboardCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [reportesPorCategoria, setReportesPorCategoria] = useState<ChartData[]>([]);
  const [reportesPorCategoriaEstado, setReportesPorCategoriaEstado] = useState<ChartData[]>([]);
  const [categoriasMasUsadas, setCategoriasMasUsadas] = useState<ChartData[]>([]);
  const [tiposEstado, setTiposEstado] = useState<Record<string, { nombre: string; color: string }>>({});

  useEffect(() => {
    const categoriasData = getCategories();
    const reportesData = obtenerReportes().filter(r => r.activo);
    const estadosData = getEstados();

    // Configurar tipos de estado
    const estadosPorTipo: Record<string, { nombre: string; color: string }> = {};
    estadosData.forEach(estado => {
      estadosPorTipo[estado.nombre] = {
        nombre: estado.nombre,
        color: estado.color || '#9b87f5'
      };
    });
    setTiposEstado(estadosPorTipo);

    // Reportes por categoría
    const categorias = reportesData.reduce((acc: { [key: string]: ChartData }, reporte) => {
      const categoriaId = reporte.categoria?.id || 'sin-categoria';
      if (!acc[categoriaId]) {
        acc[categoriaId] = { 
          name: reporte.categoria?.nombre || 'Sin Categoría', 
          value: 0,
          color: reporte.categoria?.color || '#9CA3AF'
        };
      }
      acc[categoriaId].value += 1;
      return acc;
    }, {});

    setReportesPorCategoria(Object.values(categorias).filter(cat => cat.value > 0));

    // Reportes por categoría y estado
    const reportesPorCategoriaEstado = categoriasData.map(categoria => {
      const reportes = reportesData.filter(r => r.categoria?.id === categoria.id);
      const estados = reportes.reduce((acc: { [key: string]: number }, reporte) => {
        const estado = reporte.estado.nombre;
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      }, {});

      return {
        name: categoria.nombre,
        value: reportes.length,
        color: categoria.color,
        ...estados
      };
    });

    setReportesPorCategoriaEstado(reportesPorCategoriaEstado);

    // Categorías más usadas
    const categoriasMasUsadas = Object.values(categorias)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    setCategoriasMasUsadas(categoriasMasUsadas);
    setCategorias(categoriasData);
  }, []);

  return (
    <div className="space-y-6">
      <CategoryTotalCard totalCategorias={categorias.length} />
      <CategoryCharts 
        reportesPorCategoria={reportesPorCategoria}
        reportesPorCategoriaEstado={reportesPorCategoriaEstado}
        tiposEstado={tiposEstado}
      />
      <MostUsedCategories categoriasMasUsadas={categoriasMasUsadas} />
    </div>
  );
};

export default DashboardCategorias;
