import React from 'react';
import { Usuario } from '@/types/tipos';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import BulkActionsBar from '@/components/admin/usuarios/listaUsuarios/BulkActionsBar';
import UsuariosTable from '@/components/admin/usuarios/listaUsuarios/UsuariosTable';
import Pagination from '@/components/layout/Pagination';
import DeleteUserDialog from '@/components/admin/usuarios/listaUsuarios/DeleteUserDialog';
import { ATTRIBUTES, PROPERTY_FILTERS } from '@/constants/admin/user/ListaUsuariosConstants';
import { ITEMS_PER_PAGE } from '@/utils/userListConstants';
import { ListaUsuariosContentProps } from '@/props/admin/usuarios/PropListaUsuarios';



const ListaUsuariosContent: React.FC<ListaUsuariosContentProps> = ({
  usuarios,
  filteredUsuarios,
  currentPage,
  isLoading,
  selectedUsers,
  selectedRoleId,
  selectedEstado,
  showDeleteDialog,
  usuarioAEliminar,
  usuariosAEliminar,
  isAllSelected,
  isSomeSelected,
  onFilterChange,
  onExport,
  onNavigate,
  onRoleChange,
  onEstadoChange,
  onBulkDelete,
  onCancel,
  onSelectAll,
  onEstadoChangeUser,
  onDelete,
  onSelect,
  onPageChange,
  onOpenChange,
  onConfirmDelete,
  onCancelDelete,
}) => {
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <SearchFilterBar
        data={usuarios}
        onFilterChange={onFilterChange}
        attributes={ATTRIBUTES}
        propertyFilters={PROPERTY_FILTERS}
        searchPlaceholder="Buscar usuarios..."
        resultLabel="usuarios"
        exportLabel="Exportar CSV"
        exportFunction={onExport}
        navigateFunction={onNavigate}
        navigateLabel="Nuevo Usuario"
      />

      {selectedUsers.size > 0 && (
        <BulkActionsBar
          selectedUsers={selectedUsers}
          selectedRoleId={selectedRoleId}
          selectedEstado={selectedEstado}
          onRoleChange={onRoleChange}
          onEstadoChange={onEstadoChange}
          onBulkRoleUpdate={() => {}}
          onBulkEstadoUpdate={() => {}}
          onBulkDelete={onBulkDelete}
          onCancel={onCancel}
        />
      )}

      <UsuariosTable
        isLoading={isLoading}
        currentItems={currentItems}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        selectedUsers={selectedUsers}
        onSelectAll={onSelectAll}
        onEstadoChange={onEstadoChangeUser}
        onDelete={onDelete}
        onSelect={onSelect}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={filteredUsuarios.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <DeleteUserDialog
        open={showDeleteDialog}
        onOpenChange={onOpenChange}
        usuarioAEliminar={usuarioAEliminar}
        usuariosAEliminar={usuariosAEliminar}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </div>
  );
};

export default ListaUsuariosContent; 