import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Usuario } from '@/types/tipos';
import { UsuarioRowProps, PaginationProps } from '@/types/usuario';
import RoleSelector from '@/components/admin/selector/RoleSelector';
import { Checkbox } from '@/components/ui/checkbox';

export const UsuarioTableHeader: React.FC<{ onSelectAll: (checked: boolean) => void }> = ({ onSelectAll }) => (
  <TableHeader>
    <TableRow className="bg-gray-50">
      <TableHead className="w-[50px]">
        <Checkbox
          onCheckedChange={onSelectAll}
          aria-label="Seleccionar todos"
        />
      </TableHead>
      <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
      <TableHead className="font-semibold text-gray-600">Email</TableHead>
      <TableHead className="font-semibold text-gray-600">Rol</TableHead>
      <TableHead className="font-semibold text-gray-600">Fecha creación</TableHead>
      <TableHead className="font-semibold text-gray-600 text-center">Estado</TableHead>
      <TableHead className="font-semibold text-gray-600 text-right">Acciones</TableHead>
    </TableRow>
  </TableHeader>
);

export const LoadingRow: React.FC = () => (
  <TableRow>
    <TableCell colSpan={7} className="text-center py-8">
      <div className="flex justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    </TableCell>
  </TableRow>
);

export const EmptyStateRow: React.FC = () => (
  <TableRow>
    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
      No se encontraron usuarios con los criterios seleccionados
    </TableCell>
  </TableRow>
);

export const UsuarioRow: React.FC<UsuarioRowProps & { onSelect: (id: string, checked: boolean) => void; isSelected: boolean }> = ({ 
  usuario, 
  onEstadoChange, 
  onDelete, 
  onRoleChange,
  onSelect,
  isSelected 
}) => (
  <TableRow key={usuario.id}>
    <TableCell>
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelect(usuario.id, checked as boolean)}
        aria-label={`Seleccionar ${usuario.nombre}`}
      />
    </TableCell>
    <TableCell>
      <Link to={`/admin/usuarios/${usuario.id}`} className="text-blue-600 hover:underline">
        {usuario.nombre} {usuario.apellido}
      </Link>
    </TableCell>
    <TableCell>{usuario.email}</TableCell>
    <TableCell >
      {usuario.roles && usuario.roles.length > 0 && (
        <div className={usuario.estado === 'bloqueado' ? 'pointer-events-none opacity-50' : ''}>
        <RoleSelector
          userId={usuario.id}
          currentRoleId={usuario.roles[0].id}
            onRoleChange={onRoleChange}
        />
        </div>
      )}
    </TableCell>
    <TableCell>
      {new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })}
    </TableCell>
    <TableCell className="text-center">
      <Badge 
        variant={
          usuario.estado === 'activo' ? 'success' : 
          usuario.estado === 'inactivo' ? 'inactive' : 
          'destructive'
        }
        className={`cursor-pointer ${
          usuario.estado === 'bloqueado' ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => usuario.estado !== 'bloqueado' && onEstadoChange(usuario.id)}
      >
        {usuario.estado === 'activo' ? 'Activo' : 
         usuario.estado === 'inactivo' ? 'Inactivo' : 
         'Bloqueado'}
      </Badge>
    </TableCell>
    <TableCell>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <Link to={`/admin/usuarios/${usuario.id}/editar`}>
            <PencilIcon className="h-4 w-4 text-gray-500" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600"
          onClick={() => onDelete(usuario)}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(page => 
    page === 1 || 
    page === totalPages || 
    (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Página {currentPage} de {totalPages}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {visiblePages.map((page, i, array) => {
            const showEllipsisBefore = i > 0 && array[i - 1] !== page - 1;
            const showEllipsisAfter = i < array.length - 1 && array[i + 1] !== page + 1;
            
            return (
              <div key={page} className="flex items-center">
                {showEllipsisBefore && (
                  <PaginationItem>
                    <span className="flex h-9 w-9 items-center justify-center text-gray-400">...</span>
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
                
                {showEllipsisAfter && (
                  <PaginationItem>
                    <span className="flex h-9 w-9 items-center justify-center text-gray-400">...</span>
                  </PaginationItem>
                )}
              </div>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}; 