
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getReports, filterReports, sortReports } from '@/controller/CRUD/reportController';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Search, Plus } from 'lucide-react';
import { Reporte, SortOption } from '@/types/tipos';
import SortOptions from '@/components/common/SortOptions';

const ListaReportes = () => {
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para ordenamiento
  const [sortBy, setSortBy] = useState<SortOption>({
    id: 'fecha',
    direction: 'desc',
    label: 'Fecha (más reciente)'
  });
  
  // Opciones de ordenamiento
  const sortOptions: SortOption[] = [
    { id: 'fecha', label: 'Fecha (más reciente)', direction: 'desc' },
    { id: 'fecha', label: 'Fecha (más antigua)', direction: 'asc' },
    { id: 'titulo', label: 'Título (A-Z)', direction: 'asc' },
    { id: 'titulo', label: 'Título (Z-A)', direction: 'desc' },
    { id: 'categoria', label: 'Categoría', direction: 'asc' },
    { id: 'estado', label: 'Estado', direction: 'asc' }
  ];

  // Obtener reportes
  const reportes = getReports();
  
  // Filtrar reportes por término de búsqueda
  const filteredReportes = searchTerm
    ? filterReports({ search: searchTerm })
    : reportes;
  
  // Ordenar reportes
  const sortedReportes = sortReports(filteredReportes, sortBy.id, sortBy.direction);

  // Manejar cambio de ordenamiento
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar reportes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <SortOptions 
            options={sortOptions}
            currentOptionId={`${sortBy.id}-${sortBy.direction}`}
            onSortChange={handleSortChange}
          />
          
          <Button asChild>
            <Link to="/reportes/nuevo" className="flex items-center gap-2">
              <Plus size={16} />
              Nuevo reporte
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Listado de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {sortedReportes.length > 0 ? (
              sortedReportes.map((reporte) => (
                <Link
                  key={reporte.id}
                  to={`/reportes/${reporte.id}`}
                  className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{reporte.titulo}</h3>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{reporte.ubicacion.direccion}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="bg-gray-100">
                        {reporte.categoria.nombre}
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: reporte.estado.color,
                          color: '#fff'
                        }}
                      >
                        {reporte.estado.nombre}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No se encontraron reportes
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ListaReportes;
