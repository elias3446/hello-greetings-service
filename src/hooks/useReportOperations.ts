import React from 'react';
import { Reporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { getReports, deleteReport } from '@/controller/CRUD/reportController';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';

export const useReportOperations = (
  setReportes: React.Dispatch<React.SetStateAction<Reporte[]>>,
  setFilteredReportes: React.Dispatch<React.SetStateAction<Reporte[]>>,
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setReporteAEliminar: React.Dispatch<React.SetStateAction<Reporte | null>>
) => {
  const confirmarEliminacion = async (reporte: Reporte | null) => {
    if (!reporte) return;
    
    try {
      const reportesAsignados = getReports().filter(r => 
        r.asignadoA && r.asignadoA.id === reporte.id
      );

      await registrarCambioEstado(
        reporte.asignadoA,
        reporte.estado.nombre,
        'eliminado',
        reporte.asignadoA,
        'Reporte eliminado del sistema',
        'otro'
      );

      for (const r of reportesAsignados) {
        await registrarCambioEstadoReporte(
          r,
          `${reporte.asignadoA?.nombre} ${reporte.asignadoA?.apellido}`,
          'Sin asignar',
          reporte.asignadoA,
          'Reporte eliminado del sistema',
          'asignacion_reporte'
        );
      }

      const success = deleteReport(reporte.id);
      
      if (success) {
        setReportes(prev => prev.filter(r => r.id !== reporte.id));
        setFilteredReportes(prev => prev.filter(r => r.id !== reporte.id));
        toast.success(`Reporte ${reporte.titulo} eliminado correctamente`);
      } else {
        throw new Error('Error al eliminar el reporte');
      }
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
      toast.error('Error al eliminar el reporte');
    } finally {
      setShowDeleteDialog(false);
      setReporteAEliminar(null);
    }
  };

  const handleDeleteReporte = (reporte: Reporte) => {
    setReporteAEliminar(reporte);
    setShowDeleteDialog(true);
  };

  return {
    confirmarEliminacion,
    handleDeleteReporte,
  };
}; 