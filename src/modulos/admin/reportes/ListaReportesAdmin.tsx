import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlusIcon, 
  PencilIcon, 
  Trash2Icon, 
  DownloadIcon,
  FileText
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Reporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { getReports, filterReports, sortReports } from '@/controller/reportController';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import CategoriaSelector from '@/components/admin/selector/CategoriaSelector';
import EstadoSelector from '@/components/admin/selector/EstadoSelector';
import UsuarioSelector from '@/components/admin/selector/UsuarioSelector';

const ListaReportesAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [filteredReportes, setFilteredReportes] = useState<Reporte[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string | null>(null);
  const [categoriaFilter, setCategoriaFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('titulo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentField, setCurrentField] = useState<string | undefined>();
  const [selectedFilterValues, setSelectedFilterValues] = useState<any[]>([]);
  const itemsPerPage = 10;

  const sortOptions = [
    { value: 'titulo', label: 'Título' },
    { value: 'ubicacion', label: 'Ubicación' },
    { value: 'asignadoA', label: 'Asignado a' },
    { value: 'fechaCreacion', label: 'Fecha creación' }
  ];

  const filterOptions = [
    { value: 'estado', label: 'Estado' },
    { value: 'categoria', label: 'Categoría' }
  ];

  useEffect(() => {
    // Cargar reportes
    setIsLoading(true);
    try {
      const data = getReports();
      setReportes(data);
      setFilteredReportes(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error al cargar reportes");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Aplicar filtros, búsqueda y ordenamiento
    let result = [...reportes];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        reporte => reporte.titulo.toLowerCase().includes(term) ||
                reporte.ubicacion.direccion.toLowerCase().includes(term) ||
                reporte.asignadoA?.nombre.toLowerCase().includes(term) ||
                reporte.estado.nombre.toLowerCase().includes(term) ||
                reporte.estado.id.toString().toLowerCase().includes(term) ||
                reporte.categoria.nombre.toLowerCase().includes(term) ||
                reporte.fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase().includes(term)
      );
    }

    // Separar los valores de filtro por tipo
    const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);
    const filterCategories = selectedFilterValues.filter(value => value.startsWith('categoria:')).map(value => value.split(':')[1]);

    // Aplicar filtro de valores (si hay valores seleccionados)
    if (filterValues.length > 0) {
      result = result.filter(reporte => 
        filterValues.includes(getFieldValue(reporte, sortBy))
      );
    }

    // Aplicar filtro de estados sobre el resultado anterior
    if (filterStates.length > 0) {
      result = result.filter(reporte => 
        filterStates.includes(reporte.estado.nombre)
      );
    }

    // Aplicar filtro de categorías sobre el resultado anterior
    if (filterCategories.length > 0) {
      result = result.filter(reporte => 
        filterCategories.includes(reporte.categoria.nombre)
      );
    }

    // Aplicar ordenamiento
    result = sortReports(result, sortBy, sortDirection);

    setFilteredReportes(result);
    setCurrentPage(1);
  }, [reportes, searchTerm, sortBy, sortDirection, selectedFilterValues]);

  // Función para obtener el valor del campo según el campo actual
  const getFieldValue = (reporte: Reporte, field: string): string => {
    switch (field) {
      case 'titulo':
        return reporte.titulo;
      case 'ubicacion':
        return reporte.ubicacion.direccion;
      case 'asignadoA':
        return reporte.asignadoA?.nombre || 'Sin asignar';
      case 'fechaCreacion':
        return new Date(reporte.fechaCreacion).toLocaleDateString('es-ES');
      case 'estado':
        return reporte.estado.nombre;
      case 'categoria':
        return reporte.categoria.nombre;
      default:
        return '';
    }
  };

  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (values: any[]) => {
    setSelectedFilterValues(values);
  };

  const handleExportReportes = () => {
    const data = filteredReportes.map(reporte => ({
      titulo: reporte.titulo,
      categoria: reporte.categoria.nombre,
      estado: reporte.estado.nombre,
      fechaCreacion: new Date(reporte.fechaCreacion).toLocaleDateString('es-ES'),
      ubicacion: reporte.ubicacion.direccion,
      asignadoA: reporte.asignadoA?.nombre || 'Sin asignar'
    }));
    
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reportes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReportes = filteredReportes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReportes.length / itemsPerPage);

  return (
    <div>
      <div className="space-y-4">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={estadoFilter}
          onStatusFilterChange={setEstadoFilter}
          roleFilter={categoriaFilter}
          onRoleFilterChange={setCategoriaFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortDirection={sortDirection}
          onSortDirectionChange={handleToggleSortDirection}
          currentField={currentField}
          onCurrentFieldChange={setCurrentField}
          onFilterChange={handleFilterChange}
          onExport={handleExportReportes}
          onNewItem={() => navigate('/admin/reportes/nuevo')}
          items={reportes}
          getFieldValue={getFieldValue}
          showNewButton={true}
          newButtonLabel="Nuevo Reporte"
          showExportButton={true}
          sortOptions={sortOptions}
          filteredCount={filteredReportes.length}
          totalCount={reportes.length}
          itemLabel="reportes"
          filterOptions={filterOptions}
        />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentReportes.length > 0 ? (
                currentReportes.map((reporte) => (
                  <TableRow key={reporte.id}>
                    <TableCell>
                      <Link to={`/admin/reportes/${reporte.id}`} className="text-blue-600 hover:underline">
                        {reporte.titulo}
                      </Link>
                    </TableCell>
                    <TableCell>{reporte.categoria.nombre && (
                        <CategoriaSelector
                        ReporteId={reporte.id}
                        currentCategoriaId={reporte.categoria.id}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                        {reporte.estado.nombre && (
                        <EstadoSelector
                        ReporteId={reporte.id}
                        currentEstadoId={reporte.estado.id}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>{reporte.ubicacion.direccion}</TableCell>
                    <TableCell>
                      <UsuarioSelector
                        ReporteId={reporte.id}
                        currentUsuarioId={reporte.asignadoA?.id}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/reportes/${reporte.id}`)}
                        >
                          <PencilIcon className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            // Implementar lógica de eliminación
                            toast.success('Reporte eliminado correctamente');
                          }}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No se encontraron reportes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default ListaReportesAdmin;
