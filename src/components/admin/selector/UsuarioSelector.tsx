import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsers } from '@/controller/CRUD/userController';
import { updateReport, getReportById } from '@/controller/CRUD/reportController';
import { toast } from '@/components/ui/sonner';
import { Reporte, Usuario } from '@/types/tipos';
import { Badge } from "@/components/ui/badge";
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';

interface UsuarioSelectorProps {
  ReporteId: string;
  currentUsuarioId: string;
  onUsuarioChange?: (newUsuario: Usuario) => void;
}

const UsuarioSelector: React.FC<UsuarioSelectorProps> = ({ 
  ReporteId, 
  currentUsuarioId,
  onUsuarioChange 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(currentUsuarioId);
  const availableUsuario = getUsers();
  const currentUsuario = availableUsuario.find(Usuario => Usuario.id === selectedUsuarioId);

  const handleUsuarioChange = async (selectedUsuarioId: string) => {
    try {
      setIsLoading(true);
      
      if (selectedUsuarioId === "unassigned") {
        // Update the report to remove the assigned user
        const updatedReport = updateReport(ReporteId, {
          asignadoA: undefined
        });
        
        if (!updatedReport) {
          throw new Error('Error al actualizar el reporte');
        }

        // Registrar el cambio en el historial del usuario anterior
        if (currentUsuario) {
          registrarCambioEstado(
            currentUsuario,
            `Reporte ${ReporteId} asignado`,
            'Sin reporte asignado',
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
            `Desasignación de reporte ${ReporteId}`,
            'asignacion_reporte'
          );
        }

        // Registrar el cambio en el historial del reporte
        const reporte = getReportById(ReporteId);
        if (reporte) {
          registrarCambioEstadoReporte(
            reporte,
            currentUsuario ? `${currentUsuario.nombre} ${currentUsuario.apellido}` : 'Sin asignar',
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
        
        setSelectedUsuarioId(selectedUsuarioId);
        toast.success('Reporte desasignado correctamente');
        return;
      }
      
      // Find the selected Usuario object
      const selectedUsuario = availableUsuario.find(Usuario => Usuario.id === selectedUsuarioId);
      
      if (!selectedUsuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar si el usuario está bloqueado o inactivo
      if (selectedUsuario.estado === 'bloqueado' || selectedUsuario.estado === 'inactivo') {
        toast.error('No se puede asignar a un usuario bloqueado o inactivo');
        return;
      }
      
      // Update the report with the new user
      const updatedReport = updateReport(ReporteId, {
        asignadoA: selectedUsuario
      });
      
      if (!updatedReport) {
        throw new Error('Error al actualizar el reporte');
      }

      // Registrar el cambio en el historial del usuario anterior
      if (currentUsuario) {
        registrarCambioEstado(
          currentUsuario,
          `Reporte ${ReporteId} asignado`,
          'Sin reporte asignado',
          selectedUsuario,
          `Desasignación de reporte ${ReporteId}`,
          'asignacion_reporte'
        );
      }

      // Registrar el cambio en el historial del nuevo usuario
      registrarCambioEstado(
        selectedUsuario,
        'Sin reporte asignado',
        `Reporte ${ReporteId} asignado`,
        selectedUsuario,
        `Asignación de reporte ${ReporteId}`,
        'asignacion_reporte'
      );

      // Registrar el cambio en el historial del reporte
      const reporte = getReportById(ReporteId);
      if (reporte) {
        registrarCambioEstadoReporte(
          reporte,
          currentUsuario ? `${currentUsuario.nombre} ${currentUsuario.apellido}` : 'Sin asignar',
          `${selectedUsuario.nombre} ${selectedUsuario.apellido}`,
          selectedUsuario,
          `Asignación de reporte`,
          'asignacion_reporte'
        );
      }
      
      setSelectedUsuarioId(selectedUsuarioId);
      if (onUsuarioChange) {
        onUsuarioChange(selectedUsuario);
      }
      toast.success('Usuario asignado correctamente');
    } catch (error) {
      console.error('Error al cambiar el usuario:', error);
      toast.error('Error al asignar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      value={selectedUsuarioId}
      onValueChange={handleUsuarioChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[180px] h-9">
        <SelectValue placeholder="Seleccionar usuario">
          {currentUsuario ? (
            <div className="flex items-center gap-2">
              <span>{currentUsuario.nombre} {currentUsuario.apellido}</span>
              {currentUsuario.estado === 'bloqueado' && (
                <Badge variant="destructive">Bloqueado</Badge>
              )}
              {currentUsuario.estado === 'inactivo' && (
                <Badge variant="secondary">Inactivo</Badge>
              )}
            </div>
          ) : (
            "Seleccionar usuario"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Sin asignar</SelectItem>
        {availableUsuario
          .filter(usuario => usuario.estado === 'activo')
          .map((usuario) => (
            <SelectItem 
              key={usuario.id} 
              value={usuario.id}
            >
              {usuario.nombre} {usuario.apellido}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default UsuarioSelector;
