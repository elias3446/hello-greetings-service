import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  PencilIcon, 
  Trash2Icon,
  Check,
  X
} from 'lucide-react';
import Pagination from '@/components/layout/Pagination';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { obtenerRoles } from '@/controller/CRUD/role/roleController';
import type { Rol } from '@/types/tipos';
import { Checkbox } from '@/components/ui/checkbox';

const ListaRoles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Rol[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Rol[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentField, setCurrentField] = useState<string | undefined>();
  const [selectedFilterValues, setSelectedFilterValues] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const itemsPerPage = 5;

  useEffect(() => {
    // Cargar roles
    setIsLoading(true);
    try {
      const data = obtenerRoles();
      setRoles(data);
      setFilteredRoles(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error al cargar roles");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Aplicar filtros, búsqueda y ordenamiento
    let result = [...roles];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        rol => rol.nombre.toLowerCase().includes(term) ||
              rol.fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase().includes(term) ||  
              (rol.descripcion && rol.descripcion.toLowerCase().includes(term)) ||
              rol.activo.toString().toLowerCase().includes(term) ||
              rol.permisos.some(permiso => permiso.nombre.toLowerCase().includes(term)) ||
              rol.id.toString().toLowerCase().includes(term)
      );
    }

    // Separar los valores de filtro por tipo
    const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);

    // Aplicar filtro de valores (si hay valores seleccionados)
    if (filterValues.length > 0) {
      result = result.filter(rol => 
        filterValues.includes(getFieldValue(rol, sortBy))
      );
    }

    // Aplicar filtro de estados sobre el resultado anterior
    if (filterStates.length > 0) {
      result = result.filter(rol => 
        filterStates.includes(rol.activo ? 'Activo' : 'Inactivo')
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

    setFilteredRoles(result);
    setCurrentPage(1);
  }, [roles, searchTerm, sortBy, sortDirection, selectedFilterValues]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  // Función para obtener el valor del campo según el campo actual
  const getFieldValue = (rol: Rol, field: string): string => {
    switch (field) {
      case 'nombre':
        return rol.nombre;
      case 'descripcion':
        return rol.descripcion || 'Sin descripción';
      case 'fechaCreacion':
        return rol.fechaCreacion instanceof Date ? 
          rol.fechaCreacion.toLocaleDateString('es-ES') : 
          new Date(rol.fechaCreacion).toLocaleDateString('es-ES');
      case 'estado':
        return rol.activo ? 'Activo' : 'Inactivo';
      default:
        return '';
    }
  };

  // Función para manejar la eliminación de roles
  const handleDeleteRole = (rolId: string, nombreRol: string) => {
    // For now, just show a toast message (implementation pending)
    toast.error(`Función de eliminar rol ${nombreRol} en desarrollo`);
  };

  // Función para cambiar el estado del rol (activo/inactivo)
  const handleEstadoChange = (rolId: string) => {
    const rol = roles.find(r => r.id === rolId);
    if (rol) {
      const nuevoEstado = !rol.activo;
      
      // Update the roles array
      setRoles(prevRoles => prevRoles.map(r => {
        if (r.id === rolId) {
          return { ...r, activo: nuevoEstado };
        }
        return r;
      }));
      
      toast.success(`Estado del rol actualizado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
    }
  };

  const handleSelectRole = (roleId: string, checked: boolean) => {
    setSelectedRoles(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(roleId);
      } else {
        newSelected.delete(roleId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRoles(new Set(filteredRoles.map(role => role.id)));
    } else {
      setSelectedRoles(new Set());
    }
  };

  // Determinar si todos los roles filtrados están seleccionados
  const isAllSelected = filteredRoles.length > 0 && 
    filteredRoles.every(role => selectedRoles.has(role.id));

  // Determinar si algunos roles están seleccionados
  const isSomeSelected = filteredRoles.some(role => selectedRoles.has(role.id));

  return (
    <div>
      <div className="space-y-4">

        {selectedRoles.size > 0 && (
          <div className="flex items-center gap-4 p-4 rounded-md border">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {selectedRoles.size} {selectedRoles.size === 1 ? 'rol seleccionado' : 'roles seleccionados'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setSelectedRoles(new Set())}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected && !isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Seleccionar todos los roles"
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
                <TableHead className="font-semibold text-gray-600">Descripción</TableHead>
                <TableHead className="font-semibold text-gray-600">Permisos</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Estado</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Fecha creación</TableHead>
                <TableHead className="font-semibold text-gray-600 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentRoles.length > 0 ? (
                currentRoles.map((rol) => (
                  <TableRow key={rol.id}>
                    <TableCell className="w-[50px]">
                      <Checkbox
                        checked={selectedRoles.has(rol.id)}
                        onCheckedChange={(checked) => handleSelectRole(rol.id, checked as boolean)}
                        aria-label={`Seleccionar rol ${rol.nombre}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/roles/${rol.id}`} className="text-blue-600 hover:underline">
                        {rol.nombre}
                      </Link>
                    </TableCell>
                    <TableCell>{rol.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rol.permisos && rol.permisos.slice(0, 3).map((permiso, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {typeof permiso === 'string' ? permiso : permiso.nombre}
                          </Badge>
                        ))}
                        {rol.permisos && rol.permisos.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{rol.permisos.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={rol.activo ? 'success' : 'inactive'}
                        className="cursor-pointer"
                        onClick={() => handleEstadoChange(rol.id)}
                      >
                        {rol.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(rol.fechaCreacion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={`/admin/roles/${rol.id}/editar`}>
                            <PencilIcon className="h-4 w-4 text-gray-500" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteRole(rol.id, rol.nombre)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    No se encontraron roles con los criterios seleccionados
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
          totalItems={filteredRoles.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default ListaRoles;
