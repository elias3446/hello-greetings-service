import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategories } from '@/controller/CRUD/category/categoryController';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import { usuarios } from '@/data/usuarios';
import { prioridades } from '@/data/categorias';
import { BulkActionsProps } from '@/props/admin/report/PropListaReportesAdmin';

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedReportes,
  selectedCategoriaId,
  selectedEstado,
  selectedUsuarioId,
  selectedPrioridadId,
  selectedActivo,
  onCategoriaChange,
  onEstadoChange,
  onUsuarioChange,
  onPrioridadChange,
  onActivoChange,
  onBulkCategoriaUpdate,
  onBulkEstadoUpdate,
  onBulkAsignacionUpdate,
  onBulkPrioridadUpdate,
  onBulkActivoUpdate,
  onBulkDelete,
  onCancel
}) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-md border">
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">
          {selectedReportes.size} {selectedReportes.size === 1 ? 'reporte seleccionado' : 'reportes seleccionados'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <Select
              value={selectedCategoriaId}
              onValueChange={onCategoriaChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {getCategories().map(categoria => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onBulkCategoriaUpdate}
            disabled={!selectedCategoriaId}
            variant="default"
            size="sm"
          >
            Actualizar Categorías
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <Select
              value={selectedEstado.id}
              onValueChange={onEstadoChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {getEstados().map(estado => (
                  <SelectItem key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onBulkEstadoUpdate}
            variant="default"
            size="sm"
            disabled={!selectedEstado.id}
          >
            Actualizar Estados
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <Select
              value={selectedUsuarioId}
              onValueChange={onUsuarioChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No asignar</SelectItem>
                {usuarios.map(usuario => (
                  <SelectItem key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                    {usuario.estado === 'inactivo' && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-xs text-gray-600">Inactivo</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onBulkAsignacionUpdate}
            variant="default"
            size="sm"
            disabled={!selectedUsuarioId}
          >
            Actualizar Asignaciones
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <Select
              value={selectedPrioridadId}
              onValueChange={onPrioridadChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin prioridad</SelectItem>
                {prioridades.map(prioridad => (
                  <SelectItem key={prioridad.id} value={prioridad.id}>
                    {prioridad.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onBulkPrioridadUpdate}
            variant="default"
            size="sm"
            disabled={!selectedPrioridadId}
          >
            Actualizar Prioridades
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <Select
              value={selectedActivo ? 'activo' : 'inactivo'}
              onValueChange={onActivoChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado activo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onBulkActivoUpdate}
            variant="default"
            size="sm"
            disabled={selectedActivo === undefined}
          >
            Actualizar Estado Activo
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={onBulkDelete}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            Eliminar Seleccionados
          </Button>
        </div>
      </div>

      <Button
        onClick={onCancel}
        variant="outline"
        size="sm"
      >
        Cancelar
      </Button>
    </div>
  );
};

export default BulkActions; 