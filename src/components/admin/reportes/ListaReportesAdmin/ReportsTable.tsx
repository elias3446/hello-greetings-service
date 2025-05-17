import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, PencilIcon, Trash2 } from 'lucide-react';
import { getCategories } from '@/controller/CRUD/category/categoryController';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import { usuarios } from '@/data/usuarios';
import { ReportsTableProps } from '@/props/admin/report/PropListaReportesAdmin';

const ReportsTable: React.FC<ReportsTableProps> = ({
  isLoading,
  filteredData,
  currentItems,
  selectedReportes,
  isAllSelected,
  isSomeSelected,
  onSelectReporte,
  onSelectAll,
  onNavigate,
  onDeleteReporte,
  onCategoriaChange,
  onEstadoChange,
  onAsignacionChange
}) => {
  const handleTitleClick = (reporteId: string) => {
    onNavigate(`/admin/reportes/${reporteId}`);
  };

  const handleEditClick = (reporteId: string) => {
    onNavigate(`/admin/reportes/${reporteId}/editar`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Seleccionar todos"
              />
            </TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No se encontraron reportes
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((reporte) => (
              <TableRow key={reporte.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedReportes.has(reporte.id)}
                    onCheckedChange={(checked) => onSelectReporte(reporte.id, checked as boolean)}
                    aria-label={`Seleccionar reporte ${reporte.titulo}`}
                  />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleTitleClick(reporte.id)}
                    className="text-primary hover:underline"
                  >
                    {reporte.titulo}
                  </button>
                </TableCell>
                <TableCell>
                  <Select
                    value={reporte.categoria?.id || ''}
                    onValueChange={(value) => onCategoriaChange(reporte, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getCategories().map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={reporte.estado?.id || ''}
                    onValueChange={(value) => onEstadoChange(reporte, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getEstados().map((estado) => (
                        <SelectItem key={estado.id} value={estado.id}>
                          {estado.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(reporte.fechaCreacion).toLocaleDateString()}</TableCell>
                <TableCell>{reporte.ubicacion?.direccion || ''}</TableCell>
                <TableCell>
                  <Select
                    value={reporte.asignadoA?.id || ''}
                    onValueChange={(value) => onAsignacionChange(reporte, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(reporte.id)}
                    >

<PencilIcon className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => onDeleteReporte(reporte)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable; 