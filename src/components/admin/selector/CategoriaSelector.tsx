import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from '@/controller/CRUD/category/categoryController';
import { getReportById, updateReport } from '@/controller/CRUD/report/reportController';
import { toast } from '@/components/ui/sonner';
import {  Categoria} from '@/types/tipos';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';

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
        throw new Error('Categoría no encontrada');
      }
      
      // Call the onCategoriaChange callback if provided
      if (onCategoriaChange) {
        await onCategoriaChange(selectedCategoria);
      }
      
      // Actualizar el Categoria local para reflejar el cambio inmediatamente
      setSelectedCategoriaId(selectedCategoriaId);
      
    } catch (error) {
      console.error('Error al cambiar la categoría:', error);
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
        <SelectValue placeholder="Seleccionar categoría">
          {currentCategoria?.nombre || "Seleccionar categoría"}
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
