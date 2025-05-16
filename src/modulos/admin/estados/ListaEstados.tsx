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
  SearchIcon, 
  FilterIcon, 
  ArrowDownIcon, 
  ArrowUpIcon, 
  DownloadIcon,
  CheckIcon
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/layout/Pagination';
import { EstadoReporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { getEstados, updateEstado, deleteEstado } from '@/controller/CRUD/estado/estadoController';
import FilterByValues from '@/components/common/FilterByValues';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { Checkbox } from '@/components/ui/checkbox';

const ListaEstados: React.FC = () => {
  const navigate = useNavigate();
  const [estados, setEstados] = useState<EstadoReporte[]>([]);
  const [filteredEstados, setFilteredEstados] = useState<EstadoReporte[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [tipoFilter, setTipoFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentField, setCurrentField] = useState<string | undefined>('nombre');
  const [selectedFilterValues, setSelectedFilterValues] = useState<any[]>([]);
  const [selectedEstados, setSelectedEstados] = useState<Set<string>>(new Set());
  const itemsPerPage = 5;

  const sortOptions = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'descripcion', label: 'Descripción' },
    { value: 'color', label: 'Color' },
    { value: 'fechaCreacion', label: 'Fecha creación' }
  ];

  const filterOptions = [
    { value: 'estado', label: 'Estado' }
  ];

  useEffect(() => {
    // Cargar estados
    setIsLoading(true);
    try {
      const data = getEstados();
      setEstados(data);
      setFilteredEstados(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error al cargar estados");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Aplicar filtros, búsqueda y ordenamiento
    let result = [...estados];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        estado => estado.nombre.toLowerCase().includes(term) ||
                estado.fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase().includes(term) ||
                estado.activo.toString().toLowerCase().includes(term) ||
                estado.id.toString().toLowerCase().includes(term) ||
                (estado.descripcion && estado.descripcion.toLowerCase().includes(term)) ||
                estado.color.toLowerCase().includes(term)
      );
    }

    // Separar los valores de filtro por tipo
    const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);

    // Aplicar filtro de valores (si hay valores seleccionados)
    if (filterValues.length > 0) {
      result = result.filter(estado => 
        filterValues.includes(getFieldValue(estado, sortBy))
      );
    }

    // Aplicar filtro de estados sobre el resultado anterior
    if (filterStates.length > 0) {
      result = result.filter(estado => 
        filterStates.includes(estado.activo ? 'Activo' : 'Inactivo')
      );
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'nombre':
          comparison = a.nombre.localeCompare(b.nombre);
          break;
        case 'descripcion':
          comparison = (a.descripcion || '').localeCompare(b.descripcion || '');
          break;
        case 'color':
          comparison = a.color.localeCompare(b.color);
          break;
        case 'fechaCreacion':
          const fechaA = a.fechaCreacion instanceof Date ? a.fechaCreacion : new Date(a.fechaCreacion);
          const fechaB = b.fechaCreacion instanceof Date ? b.fechaCreacion : new Date(b.fechaCreacion);
          comparison = fechaA.getTime() - fechaB.getTime();
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredEstados(result);
    setCurrentPage(1);
  }, [estados, searchTerm, sortBy, sortDirection, selectedFilterValues]);

  // Función para obtener el valor del campo según el campo actual
  const getFieldValue = (estado: EstadoReporte, field: string): string => {
    switch (field) {
      case 'nombre':
        return estado.nombre;
      case 'descripcion':
        return estado.descripcion || 'Sin descripción';
      case 'color':
        return estado.color;
      case 'fechaCreacion':
        return estado.fechaCreacion instanceof Date ? 
          estado.fechaCreacion.toLocaleDateString('es-ES') : 
          new Date(estado.fechaCreacion).toLocaleDateString('es-ES');
      case 'estado':
        return estado.activo ? 'Activo' : 'Inactivo';
      default:
        return '';
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEstados = filteredEstados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEstados.length / itemsPerPage);

  const handleEstadoChange = (estadoId: string) => {
    const estado = estados.find(e => e.id === estadoId);
    if (estado) {
      const nuevoEstado = !estado.activo;
      const estadoActualizado = updateEstado(estadoId, { activo: nuevoEstado });
      if (estadoActualizado) {
        setEstados(estados.map(e => e.id === estadoId ? estadoActualizado : e));
        toast.success(`Estado actualizado a ${nuevoEstado ? 'activo' : 'inactivo'}`);
      }
    }
  };

  const handleDeleteEstado = (estadoId: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este estado?')) {
      const resultado = deleteEstado(estadoId);
      if (resultado) {
        setEstados(estados.filter(e => e.id !== estadoId));
        toast.success('Estado eliminado correctamente');
      }
    }
  };

  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (values: any[]) => {
    // Separar los valores en filtros de estado y valores normales
    const estadoFilters = values.filter(value => value.startsWith('estado:'));
    const normalFilters = values.filter(value => !value.includes(':'));

    // Si hay valores normales, reemplazar todos los valores normales anteriores
    if (normalFilters.length > 0) {
      setSelectedFilterValues(prev => 
        [...prev.filter(value => value.startsWith('estado:')), ...normalFilters]
      );
    } else {
      // Si no hay valores normales, mantener solo los filtros de estado
      setSelectedFilterValues(estadoFilters);
    }
  };

  const handleExportEstados = () => {
    // Implementación para exportar estados
    const data = filteredEstados.map(estado => ({
      nombre: estado.nombre,
      descripcion: estado.descripcion || '',
      color: estado.color,
      fechaCreacion: new Date(estado.fechaCreacion).toLocaleDateString('es-ES'),
      estado: estado.activo ? 'Activo' : 'Inactivo'
    }));
    
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'estados_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Datos exportados correctamente');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
    setTipoFilter(null);
    setSortBy('nombre');
    setSortDirection('asc');
    // Mantener los filtros de estado al limpiar
    setSelectedFilterValues(prev => 
      prev.filter(value => value.startsWith('estado:'))
    );
    setCurrentField('nombre');
  };

  // Contar los resultados después de aplicar los filtros
  const filteredCount = filteredEstados.length;
  const totalCount = estados.length;

  const handleNuevoEstado = () => {
    navigate('/admin/estados/nuevo');
  };

  const handleSelectEstado = (estadoId: string, checked: boolean) => {
    setSelectedEstados(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(estadoId);
      } else {
        newSelected.delete(estadoId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEstados(new Set(filteredEstados.map(estado => estado.id)));
    } else {
      setSelectedEstados(new Set());
    }
  };

  // Determinar si todos los estados filtrados están seleccionados
  const isAllSelected = filteredEstados.length > 0 && 
    filteredEstados.every(estado => selectedEstados.has(estado.id));

  // Determinar si algunos estados están seleccionados
  const isSomeSelected = filteredEstados.some(estado => selectedEstados.has(estado.id));

  return (
    <div>
      <div className="space-y-4">
        {/* Barra de búsqueda y acciones */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roleFilter={null}
          onRoleFilterChange={() => {}}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortDirection={sortDirection}
          onSortDirectionChange={handleToggleSortDirection}
          onCurrentFieldChange={setCurrentField}
          onFilterChange={handleFilterChange}
          onExport={handleExportEstados}
          onNewItem={handleNuevoEstado}
          items={estados}
          getFieldValue={getFieldValue}
          newButtonLabel="Nuevo Estado"
          sortOptions={sortOptions}
          filteredCount={filteredEstados.length}
          totalCount={estados.length}
          itemLabel="estados"
          filterOptions={[
            { value: 'estado', label: 'Estado' }
          ]}
        />

        {selectedEstados.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md border">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {selectedEstados.size} {selectedEstados.size === 1 ? 'estado seleccionado' : 'estados seleccionados'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setSelectedEstados(new Set())}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Tabla de estados */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected && !isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Seleccionar todos los estados"
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
                <TableHead className="font-semibold text-gray-600">Descripción</TableHead>
                <TableHead className="font-semibold text-gray-600">Color</TableHead>
                <TableHead className="font-semibold text-gray-600">Fecha Creación</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Estado</TableHead>
                <TableHead className="font-semibold text-gray-600 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentEstados.length > 0 ? (
                currentEstados.map((estado) => (
                  <TableRow key={estado.id}>
                    <TableCell className="w-[50px]">
                      <Checkbox
                        checked={selectedEstados.has(estado.id)}
                        onCheckedChange={(checked) => handleSelectEstado(estado.id, checked as boolean)}
                        aria-label={`Seleccionar estado ${estado.nombre}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/estados/${estado.id}`} className="text-blue-600 hover:underline">
                        {estado.nombre}
                      </Link>
                    </TableCell>
                    <TableCell>{estado.descripcion || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-4 w-4 rounded-full" 
                          style={{ backgroundColor: estado.color }}
                        />
                        <span>{estado.color}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(estado.fechaCreacion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={estado.activo ? 'success' : 'inactive'}
                        className="cursor-pointer"
                        onClick={() => handleEstadoChange(estado.id)}
                      >
                        {estado.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={`/admin/estados/${estado.id}/editar`}>
                            <PencilIcon className="h-4 w-4 text-gray-500" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteEstado(estado.id)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    No se encontraron estados con los criterios seleccionados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredEstados.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default ListaEstados;
