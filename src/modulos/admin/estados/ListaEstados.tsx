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
import { toast } from 'sonner';
import { getEstados, updateEstado, deleteEstado } from '@/controller/CRUD/estado/estadoController';
import FilterByValues from '@/components/common/FilterByValues';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import { exportToCSV } from '@/utils/exportUtils';
import { getReportesPorCategoria } from '@/controller/CRUD/category/categoryController';

const ListaEstados: React.FC = () => {
  const navigate = useNavigate();
  const [estados, setEstados] = useState<EstadoReporte[]>([]);
  const [filteredEstados, setFilteredEstados] = useState<EstadoReporte[]>([]);
  const [filteredData, setFilteredData] = useState<EstadoReporte[]>([]);
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

  useEffect(() => {
    // Cargar estados
    setIsLoading(true);
    try {
      const data = getEstados();
      setEstados(data);
      setFilteredEstados(data);
      setFilteredData(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error al cargar estados");
      setIsLoading(false);
    }
  }, []);

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

  const handleFilterChange = (newData: any[], filters: any) => {
    setFilteredData(newData);
    setFilteredEstados(newData);
    setCurrentPage(1);
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEstados = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const ATTRIBUTES = [
    { label: "Nombre", value: "nombre", type: "string" as "string" },
    { label: "Descripción", value: "descripcion", type: "string" as "string" },
    { label: "Color", value: "color", type: "string" as "string" },
    { label: "Fecha Creación", value: "fechaCreacion", type: "date" as "date" },
  ];

  const PROPERTY_FILTERS = [
    { label: "Estado", value: "activo", property: "activo", type: "boolean" as "boolean" },
  ];

  const handleExport = (data: any[]) => {
    try {
      exportToCSV(
        data,
        `informes-${new Date().toLocaleDateString().replace(/\//g, '-')}`,
        Object.fromEntries(ATTRIBUTES.map(attr => [attr.value, attr.label]))
      );
      toast.success(`Se han exportado ${data.length} registros en formato CSV`);
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("No se pudo completar la exportación de datos");
    }
  };

  const handleNavigate = () => {
    console.log("Navegación a nueva pantalla");
    // Ejemplo de navegación - Puedes cambiarlo por la ruta que necesites
    // navigate("/detalles");
    toast.info("Aquí iría la navegación a otra pantalla");
  };
  
  return (
    <div>
      <div className="space-y-4">


          <SearchFilterBar
            data={estados}
            onFilterChange={handleFilterChange}
            attributes={ATTRIBUTES}
            propertyFilters={PROPERTY_FILTERS}
            searchPlaceholder="Buscar estados..."
            resultLabel="estados"
            exportLabel="Exportar CSV"
            exportFunction={handleExport}
            navigateFunction={handleNavigate}
            navigateLabel="Nuevo Estado"
          />

        {selectedEstados.size > 0 && (
          <div className="flex items-center gap-4 p-4 rounded-md border">
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
              <TableRow >
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
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default ListaEstados;
