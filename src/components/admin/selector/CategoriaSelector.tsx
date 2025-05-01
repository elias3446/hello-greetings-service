
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from '@/controller/categoryController';
import { updateReport } from '@/controller/reportController';
import { toast } from '@/components/ui/sonner';
import {  Categoria} from '@/types/tipos';

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
