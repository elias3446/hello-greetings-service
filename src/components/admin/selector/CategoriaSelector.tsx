
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from '@/controller/CRUD/categoryController';
import { getReportById, updateReport } from '@/controller/CRUD/reportController';
import { toast } from '@/components/ui/sonner';
import {  Categoria} from '@/types/tipos';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';

interface CategoriaSelectorProps {
  ReporteId: string;
  currentCategoriaId: string;
  onCategoriaChange?: (newCategoria: Categoria) => void;
}

const CategoriaSelector: React.FC<CategoriaSelectorProps> = ({ 
  ReporteId, 
  currentCategoriaId,
  onCategoriaChange 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(currentCategoriaId);
  const availableCategoria = getCategories();
  const currentCategoria = availableCategoria.find(Categoria => Categoria.id === selectedCategoriaId);

  const handleCategoriaChange = async (selectedCategoriaId: string) => {
    try {
      setIsLoading(true);
      
      // Find the selected Categoria object
      const selectedCategoria = availableCategoria.find(Categoria => Categoria.id === selectedCategoriaId);
      
      if (!selectedCategoria) {
        throw new Error('Rol no encontrado');
      }
      
      // Update the user with the new Categoria
      const updatedUser = updateReport(ReporteId, {
        categoria  : selectedCategoria // Changed from 'rol' to 'Categoria' which is an array in the Usuario type
      });
      
      if (!updatedUser) {
        throw new Error('Error al actualizar el rol del usuario');
      }
      
      // Actualizar el Categoria local para reflejar el cambio inmediatamente
      setSelectedCategoriaId(selectedCategoriaId);
      
      // Call the onCategoriaChange callback if provided
      if (onCategoriaChange && selectedCategoria) {
        onCategoriaChange(selectedCategoria);
      }

      // Registrar el cambio en el historial del reporte
      const reporte = getReportById(ReporteId);
      if (reporte) {
        registrarCambioEstadoReporte(
          reporte,
          currentCategoria ? `${currentCategoria.nombre}` : 'Sin asignar',
          'Sin asignar',
          {
            id: '0',
            nombre: 'Sistema',
            apellido: '',
            email: 'sistema@example.com',
            estado: 'activo',
            tipo: 'usuario',
            intentosFallidos: 0,
            password: 'hashed_password',
            roles: [{
              id: '1',
              nombre: 'Administrador',
              descripcion: 'Rol con acceso total al sistema',
              color: '#FF0000',
              tipo: 'admin',
              fechaCreacion: new Date('2023-01-01'),
              activo: true
            }],
            fechaCreacion: new Date('2023-01-01'),
          },
          `Desasignación de reporte`,
          'asignacion_reporte'
        );
      }
      
      toast.success('Rol actualizado correctamente');
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      toast.error('Error al actualizar el rol');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      value={selectedCategoriaId}
      onValueChange={handleCategoriaChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[180px] h-9">
        <SelectValue placeholder="Seleccionar rol">
          {currentCategoria?.nombre || "Seleccionar rol"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableCategoria.map((Categoria) => (
          <SelectItem 
            key={Categoria.id} 
            value={Categoria.id}
          >
            {Categoria.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoriaSelector;
