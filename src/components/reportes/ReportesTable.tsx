import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { Reporte } from '@/types/tipos';
import { ReporteTableProps } from '@/types/reportes';
import { formatDate } from '@/utils/reportes';
import CategoriaSelector from '@/components/admin/selector/CategoriaSelector';
import EstadoSelector from '@/components/admin/selector/EstadoSelector';
import UsuarioSelector from '@/components/admin/selector/UsuarioSelector';

export const ReportesTable: React.FC<ReporteTableProps> = ({ 
  reportes, 
  isLoading, 
  onEdit, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (reportes.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center">
          No se encontraron reportes
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {reportes.map((reporte) => (
        <TableRow key={reporte.id}>
          <TableCell>
            <Link to={`/admin/reportes/${reporte.id}`} className="text-blue-600 hover:underline">
              {reporte.titulo}
            </Link>
          </TableCell>
          <TableCell>
            {reporte.categoria.nombre && (
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
            {formatDate(reporte.fechaCreacion)}
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
                onClick={() => onEdit(reporte.id)}
              >
                <PencilIcon className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => onDelete(reporte)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}; 