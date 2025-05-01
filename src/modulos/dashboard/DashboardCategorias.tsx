
import React, { useEffect, useState } from 'react';
import { getCategories } from '@/controller/categoryController';
import { 
  getCategoriaConReportes,
  getReportesPorCategoriaEstado,
  getTiposEstado,
  CategoriaConReportes,
  CategoriaEstadoData,
  TipoEstado
} from '@/utils/dashboardUtils';
import CategoriaTotalCard from '@/components/dashboard/CategoriaTotalCard';
import CategoriasPieChart from '@/components/dashboard/CategoriasPieChart';
import CategoriasBarChart from '@/components/dashboard/CategoriasBarChart';
import CategoriasMasUsadasList from '@/components/dashboard/CategoriasMasUsadasList';

const DashboardCategorias = () => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [reportesPorCategoria, setReportesPorCategoria] = useState<CategoriaConReportes[]>([]);
  const [categoriasMasUsadas, setCategoriasMasUsadas] = useState<CategoriaConReportes[]>([]);
  const [reportesPorCategoriaEstado, setReportesPorCategoriaEstado] = useState<CategoriaEstadoData[]>([]);
  const [tiposEstado, setTiposEstado] = useState<TipoEstado>({});
  
  useEffect(() => {
    // Get all necessary data
    const categoriasData = getCategories();
    setCategorias(categoriasData);
    
    // Get status types and their colors
    const tiposEstadoData = getTiposEstado();
    setTiposEstado(tiposEstadoData);
    
    // Get report counts by category
    const reportesPorCategoriaData = getCategoriaConReportes();
    setReportesPorCategoria(reportesPorCategoriaData);
    
    // Get the 5 most used categories
    setCategoriasMasUsadas(reportesPorCategoriaData.slice(0, 5));
    
    // Get report counts by category and status
    const reportesPorCategoriaEstadoData = getReportesPorCategoriaEstado(tiposEstadoData);
    setReportesPorCategoriaEstado(reportesPorCategoriaEstadoData);
    
  }, []);

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de categorías */}
      <CategoriaTotalCard totalCategorias={categorias.length} />

      {/* Gráficos de categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoriasPieChart reportesPorCategoria={reportesPorCategoria} />
        <CategoriasBarChart 
          reportesPorCategoriaEstado={reportesPorCategoriaEstado} 
          tiposEstado={tiposEstado} 
        />
      </div>

      {/* Lista de categorías más usadas */}
      <CategoriasMasUsadasList categoriasMasUsadas={categoriasMasUsadas} />
    </div>
  );
};

export default DashboardCategorias;
