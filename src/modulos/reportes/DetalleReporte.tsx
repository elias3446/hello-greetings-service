import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, File, Calendar, CheckCircle, AlertTriangle, User, History, Edit, ArrowLeft, FileText, Clock } from 'lucide-react';
import { obtenerReportePorId, actualizarReporte } from '@/controller/CRUD/report/reportController';
import { obtenerHistorialReporte, registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';
import type { Reporte, HistorialEstadoReporte, Rol, Usuario } from '@/types/tipos';
import { ReporteAcciones } from '@/components/reportes/ReporteAcciones';
import ReporteActividad from '@/components/reportes/ReporteActividad';
import { AlertDialog, AlertDialogCancel, AlertDialogFooter, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogHeader, AlertDialogAction } from '@/components/ui/alert-dialog';
import UsuarioSelector from '@/components/admin/selector/UsuarioSelector';
import { updateUser } from '@/controller/CRUD/user/userController';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { eliminarReport } from '@/controller/controller/report/reportDeleteController';
import { actualizarAsignacionReporte } from '@/controller/controller/report/reportAssignmentController';
import { actualizarEstadoActivoReporte } from '@/controller/controller/report/reportActiveController';
import DetalleReporteBreadcrumb from '@/components/admin/reportes/DetalleReporteAdmin/DetalleReporteBreadcrumb';
import DetalleReporteMainInfo from '@/components/admin/reportes/DetalleReporteAdmin/DetalleReporteMainInfo';
import DetalleReporteSidebar from '@/components/admin/reportes/DetalleReporteAdmin/DetalleReporteSidebar';
import DetalleReporteAssignDialog from '@/components/admin/reportes/DetalleReporteAdmin/DetalleReporteAssignDialog';
import DetalleReporteDeleteDialog from '@/components/admin/reportes/DetalleReporteAdmin/DetalleReporteDeleteDialog';

const DetalleReporte = () => {
  const { id } = useParams<{ id: string }>();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [historialEstados, setHistorialEstados] = useState<HistorialEstadoReporte[]>([]);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const cargarReporte = () => {
      try {
        if (!id) {
          toast.error('ID de reporte no válido');
          navigate('/admin/reportes');
          return;
        }
        
        const reporteEncontrado = obtenerReportePorId(id);
        
        if (!reporteEncontrado) {
          toast.error('Reporte no encontrado');
          navigate('/admin/reportes');
          return;
        }
        
        setReporte(reporteEncontrado);
      } catch (error) {
        console.error('Error al cargar el reporte:', error);
        toast.error('Error al cargar el reporte');
      } finally {
        setLoading(false);
      }
    };
    
    cargarReporte();
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      console.log('Actualizando historial para reporte:', id);
      const historial = obtenerHistorialReporte(id);
      console.log('Historial obtenido:', historial);
      setHistorialEstados(historial);
    }
  }, [id, reporte]);

  if (loading) {
    return (
      <Layout titulo="Cargando reporte...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!reporte) {
    return (
      <Layout titulo="Reporte no encontrado">
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Reporte no encontrado</h2>
          <p className="text-muted-foreground mb-6">No se pudo encontrar el reporte solicitado</p>
          <Button asChild>
            <Link to="/admin/reportes">Volver a la lista</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleMarkInProgress = () => {
    toast.success('Reporte marcado como En Proceso');
  };

  const handleMarkResolved = async () => {
    if (!reporte) return;
    
    try {
      const currentReporte = obtenerReportePorId(reporte.id);
      if (!currentReporte) return;

      const usuarioSistema: Usuario = {
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
      };

      const success = await actualizarEstadoActivoReporte(currentReporte, !currentReporte.activo, usuarioSistema);
      if (success) {
        setReporte({ ...currentReporte, activo: !currentReporte.activo });
      }
    } catch (error) {
      console.error('Error al actualizar el estado del reporte:', error);
      toast.error('Error al actualizar el estado del reporte');
    }
  };

  const handleReporteChange = async (newUsuario: Usuario) => {
    try {
      if (!reporte) return;
      
      const usuarioSistema: Usuario = {
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
      };

      const success = await actualizarAsignacionReporte(reporte, newUsuario, usuarioSistema);
      if (success) {
        const reporteActualizado = obtenerReportePorId(reporte.id);
        if (reporteActualizado) {
          setReporte(reporteActualizado);
          setShowRoleDialog(false);
        }
      }
    } catch (error) {
      console.error('Error al asignar el usuario:', error);
      toast.error('Error al asignar el usuario');
    }
  };

  const getIconForAction = (tipoAccion: string) => {
    switch (tipoAccion) {
      case 'creacion':
        return <FileText className="h-4 w-4" />;
      case 'cambio_estado':
        return <History className="h-4 w-4" />;
      case 'asignacion_reporte':
        return <User className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionDescription = (registro: HistorialEstadoReporte) => {
    switch (registro.tipoAccion) {
      case 'creacion':
        return 'Reporte creado';
      case 'cambio_estado':
        return `Estado cambiado de "${registro.estadoAnterior}" a "${registro.estadoNuevo}"`;
      case 'asignacion_reporte':
        return `Asignación cambiada de "${registro.estadoAnterior}" a "${registro.estadoNuevo}"`;
      default:
        return 'Acción realizada';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Encabezado con breadcrumbs y botón de regreso */}
        <DetalleReporteBreadcrumb />
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del reporte */}
          <DetalleReporteMainInfo reporte={reporte} />
          {/* Columna derecha - Información complementaria */}
          <DetalleReporteSidebar
            reporte={reporte}
            historialEstados={historialEstados}
            onEdit={() => navigate(`/admin/reportes/${reporte.id}/editar`)}
            onMarkResolved={handleMarkResolved}
            onReassign={() => setShowRoleDialog(true)}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </div>
        {/* Diálogo para asignar usuario */}
        <DetalleReporteAssignDialog
          open={showRoleDialog}
          onOpenChange={setShowRoleDialog}
          reporte={reporte}
              onUsuarioChange={handleReporteChange}
            />
        {/* Diálogo para eliminar reporte */}
        <DetalleReporteDeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          reporte={reporte}
          onDelete={async () => {
                const usuarioSistema: Usuario = {
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
                };
                const success = await eliminarReport(reporte, usuarioSistema);
                if (success) {
                  navigate('/admin/reportes');
                }
              }}
        />
      </div>
    </>
  );
};

export default DetalleReporte;
