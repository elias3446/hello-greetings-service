import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser, deleteUser } from '@/controller/CRUD/userController';
import { roles } from '@/data/roles';
import { actividadesUsuario } from '@/data/actividades';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, PencilLine, Mail, Shield, Calendar, CheckCircle, AlertTriangle, User, History, Edit, FileText } from 'lucide-react';
import ActividadItem from '@/components/layout/ActividadItem';
import Layout from '@/components/layout/Layout';
import { toast } from '@/components/ui/sonner';
import { filterReports } from '@/controller/CRUD/reportController';
import { Reporte, Usuario, Rol } from '@/types/tipos';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getRoles } from '@/controller/CRUD/roleController';
import RoleSelector from '@/components/admin/selector/RoleSelector';
import { obtenerHistorialUsuario, registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';
import { HistorialEstadoUsuario } from '@/types/tipos';
import { Clock } from 'lucide-react';

const DetalleUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [reportesAsignados, setReportesAsignados] = useState<Reporte[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Rol | null>(null);
  const availableRoles = getRoles();
  const [historialEstados, setHistorialEstados] = useState<HistorialEstadoUsuario[]>([]);
  
  useEffect(() => {
    const cargarUsuario = () => {
      try {
        if (!id) {
          toast.error('ID de usuario no válido');
          navigate('/admin/usuarios');
          return;
        }
        
        const userData = getUserById(id);
        
        if (!userData) {
          toast.error('Usuario no encontrado');
          navigate('/admin/usuarios');
          return;
        }
        
        setUsuario(userData);
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        toast.error('Error al cargar el usuario');
      } finally {
        setLoading(false);
      }
    };
    
    cargarUsuario();
  }, [id, navigate]);
  
  useEffect(() => {
    if (id) {
      const reportes = filterReports({ userId: id });
      setReportesAsignados(reportes);
    }
  }, [id]);
  
  // Actualizar el historial cuando cambie el usuario o el id
  useEffect(() => {
    if (id) {
      console.log('Actualizando historial para usuario:', id);
      const historial = obtenerHistorialUsuario(id);
      console.log('Historial obtenido:', historial);
      setHistorialEstados(historial);
    }
  }, [id, usuario]); // Agregamos usuario como dependencia
  
  const rol = roles.find(r => usuario?.roles.some(userRole => userRole.id === r.id));
  
  const actividadesDelUsuario = actividadesUsuario.filter(actividad => actividad.usuarioId === id);

  if (loading) {
    return (
      <Layout titulo="Cargando usuario...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return (
      <Layout titulo="Usuario no encontrado">
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Usuario no encontrado</h2>
          <p className="text-muted-foreground mb-6">No se pudo encontrar el usuario solicitado</p>
          <Button asChild>
            <Link to="/admin/usuarios">Volver a la lista</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAsignarRol = () => {
    setShowRoleDialog(true);
  };

  const handleRoleChange = async (newRole: Rol) => {
    try {
      if (!usuario) return;

      const estadoAnterior = usuario.roles[0]?.nombre || 'Sin rol';
      const usuarioActualizado = updateUser(usuario.id, {
        roles: [newRole]
      });

      if (!usuarioActualizado) {
        throw new Error('Error al actualizar el rol del usuario');
      }

      setUsuario(usuarioActualizado);
      setShowRoleDialog(false);
      
      // Registrar el cambio en el historial
      registrarCambioEstado(
        usuario,
        estadoAnterior,
        newRole.nombre,
        usuarioActualizado, // En un caso real, esto debería ser el usuario que está realizando la acción
        'Cambio de rol manual',
        'cambio_rol'
      );
      
      // Actualizar el historial mostrado
      const historial = obtenerHistorialUsuario(usuario.id);
      setHistorialEstados(historial);
      
      toast.success('Rol asignado correctamente');
    } catch (error) {
      console.error('Error al asignar el rol:', error);
      toast.error('Error al asignar el rol');
    }
  };

  const handleCambiarEstado = async () => {
    try {
      if (!id || !usuario) return;
      
      // Solo permitir cambiar entre activo e inactivo si no está bloqueado
      if (usuario.estado === 'bloqueado') {
        toast.error('No se puede cambiar el estado de un usuario bloqueado directamente');
        return;
      }
      
      const estadoAnterior = usuario.estado;
      const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
      const usuarioActualizado = updateUser(id, { estado: nuevoEstado });
      
      if (usuarioActualizado) {
        setUsuario(usuarioActualizado);
        
        // Registrar el cambio en el historial
        await registrarCambioEstado(
          usuario,
          estadoAnterior,
          nuevoEstado,
          usuarioActualizado,
          'Cambio de estado manual',
          'cambio_estado'
        );

        // Registrar el cambio en el historial de cada reporte asignado
        for (const reporte of reportesAsignados) {
          await registrarCambioEstadoReporte(
            reporte,
            reporte.estado.nombre,
            reporte.estado.nombre,
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
            `Usuario asignado ${usuario.nombre} ${usuario.apellido} ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}`,
            'asignacion_reporte'
          );
        }
        
        // Actualizar el historial mostrado
        const historial = obtenerHistorialUsuario(id);
        setHistorialEstados(historial);
        
        toast.success(`Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`);
      } else {
        toast.error('Error al actualizar el estado del usuario');
      }
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      toast.error('Error al cambiar el estado del usuario');
    }
  };

  const handleEliminarUsuario = async () => {
    try {
      if (!id || !usuario) return;
      
      // Obtener todos los reportes asignados al usuario
      const reportesAsignados = filterReports({ userId: id });

      // Registrar el cambio en el historial del usuario
      await registrarCambioEstado(
        usuario,
        usuario.estado,
        'eliminado',
        usuario,
        'Usuario eliminado del sistema',
        'otro'
      );

      // Registrar el cambio en el historial de cada reporte asignado
      for (const reporte of reportesAsignados) {
        await registrarCambioEstadoReporte(
          reporte,
          `${usuario.nombre} ${usuario.apellido}`,
          'Sin asignar',
          usuario,
          'Usuario eliminado del sistema',
          'asignacion_reporte'
        );
      }

      // Actualizar el historial local
      const nuevoHistorial = await obtenerHistorialUsuario(id);
      setHistorialEstados(nuevoHistorial);

      // Eliminar el usuario
      const success = deleteUser(id);
      
      if (success) {
        toast.success('Usuario eliminado correctamente');
        navigate('/admin/usuarios');
      } else {
        throw new Error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  // Función para registrar la asignación de un reporte
  const handleAsignarReporte = (reporteId: string) => {
    try {
      if (!usuario) return;

      // Aquí iría la lógica para asignar el reporte al usuario
      // Por ejemplo: asignarReporte(reporteId, usuario.id);

      // Registrar el cambio en el historial
      registrarCambioEstado(
        usuario,
        'Sin reporte asignado',
        `Reporte ${reporteId} asignado`,
        usuario, // En un caso real, esto debería ser el usuario que está realizando la acción
        `Asignación de reporte ${reporteId}`,
        'asignacion_reporte'
      );

      // Actualizar el historial mostrado
      const historial = obtenerHistorialUsuario(usuario.id);
      setHistorialEstados(historial);

      toast.success('Reporte asignado correctamente');
    } catch (error) {
      console.error('Error al asignar el reporte:', error);
      toast.error('Error al asignar el reporte');
    }
  };

  // Función para registrar la edición de información del usuario
  const handleEditarUsuario = (datosActualizados: Partial<Usuario>) => {
    try {
      if (!usuario || !id) return;

      const usuarioActualizado = updateUser(id, datosActualizados);

      if (!usuarioActualizado) {
        throw new Error('Error al actualizar el usuario');
      }

      setUsuario(usuarioActualizado);

      // Registrar el cambio en el historial
      registrarCambioEstado(
        usuario,
        'Información anterior',
        'Información actualizada',
        usuarioActualizado, // En un caso real, esto debería ser el usuario que está realizando la acción
        'Edición de información del usuario',
        'actualizacion'
      );

      // Actualizar el historial mostrado
      const historial = obtenerHistorialUsuario(id);
      setHistorialEstados(historial);

      toast.success('Usuario actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      toast.error('Error al actualizar el usuario');
    }
  };

  // Función para obtener el ícono según el tipo de acción
  const getIconForAction = (tipoAccion: string) => {
    switch (tipoAccion) {
      case 'creacion':
        return <User className="h-4 w-4" />;
      case 'cambio_estado':
        return <Shield className="h-4 w-4" />;
      case 'cambio_rol':
        return <Shield className="h-4 w-4" />;
      case 'asignacion_reporte':
        return <FileText className="h-4 w-4" />;
      case 'actualizacion':
        return <Edit className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Función para obtener el texto descriptivo de la acción
  const getActionDescription = (registro: HistorialEstadoUsuario) => {
    switch (registro.tipoAccion) {
      case 'creacion':
        return 'Usuario creado';
      case 'cambio_estado':
        return `Estado cambiado de "${registro.estadoAnterior}" a "${registro.estadoNuevo}"`;
      case 'cambio_rol':
        return `Rol cambiado de "${registro.estadoAnterior}" a "${registro.estadoNuevo}"`;
      case 'asignacion_reporte':
        return 'Reporte asignado';
      case 'actualizacion':
        return 'Información actualizada';
      default:
        return 'Acción realizada';
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Encabezado con breadcrumbs y botón de regreso */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center">
              <Link to="/admin/usuarios" className="hover:underline flex items-center">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Usuarios
              </Link>
              <span className="mx-2">/</span>
              <span>Detalle</span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del usuario */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-muted p-6">
                <div className="flex items-center gap-4 p-4 rounded-md border">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${usuario.nombre}+${usuario.apellido}&background=random&size=100`} alt="Avatar" />
                    <AvatarFallback>{usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-2xl font-semibold">{usuario.nombre} {usuario.apellido}</div>
                    <div className="text-muted-foreground">{usuario.email}</div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="info" className="p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="activity">Actividad</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-6">
                  {/* Detalles principales */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Roles</h4>
                      <div className="flex flex-wrap gap-2">
                        {usuario.roles.map(rolUsuario => {
                          const rolInfo = roles.find(r => r.id === rolUsuario.id);
                          return (
                            <Badge 
                              key={rolUsuario.id} 
                              style={{ backgroundColor: rolInfo?.color, color: "white" }}
                            >
                              {rolInfo?.nombre}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado actual</h4>
                        <Badge 
                          variant={
                            usuario.estado === 'activo' ? 'default' : 
                            usuario.estado === 'inactivo' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {usuario.estado === 'activo' ? 'Activo' : 
                           usuario.estado === 'inactivo' ? 'Inactivo' : 
                           'Bloqueado'}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de creación</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Último acceso</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date().toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Información de contacto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{usuario.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Rol Principal</p>
                          <p className="font-medium">{rol?.nombre}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de reportes asignados */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Reportes asignados</h4>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        {reportesAsignados.length > 0 ? (
                          <div className="space-y-4">
                            {reportesAsignados.map((reporte) => (
                              <div key={reporte.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0">
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Link 
                                    to={`/admin/reportes/${reporte.id}`}
                                    className="text-sm font-medium hover:underline"
                                  >
                                    {reporte.titulo}
                                  </Link>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge 
                                      variant="outline" 
                                      style={{ backgroundColor: reporte.estado.color, color: 'white' }}
                                    >
                                      {reporte.estado.nombre}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAsignarReporte(reporte.id)}
                                >
                                  Asignar
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No hay reportes asignados</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity">
                  <div className="space-y-4">
                    {actividadesDelUsuario.length > 0 ? (
                      actividadesDelUsuario.map((actividad) => (
                        <div key={actividad.id} className="border-l-2 border-green-500 pl-4 ml-2">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0"></div>
                            <div>
                              <p className="font-medium">{actividad.descripcion}</p>
                              <p className="text-sm text-gray-500">
                                {actividad.fecha.toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {actividad.detalles?.comentario && (
                                <p className="mt-2 text-gray-600 bg-gray-50 p-2 rounded-md">
                                  {actividad.detalles.comentario}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">No hay actividad registrada para este usuario.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Columna derecha - Información complementaria */}
          <div className="space-y-6">
            {/* Tarjeta de acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones rápidas</CardTitle>
                <CardDescription>Opciones para gestionar este usuario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={`/admin/usuarios/${id}/editar`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar usuario
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowRoleDialog(true)}
                  disabled={usuario?.estado === 'bloqueado'}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Cambiar rol
                </Button>
                <Button 
                  variant={usuario.estado === 'activo' ? 'destructive' : 'default'}
                  className={`w-full justify-start ${
                    usuario.estado === 'bloqueado' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={usuario.estado !== 'bloqueado' ? handleCambiarEstado : undefined}
                  disabled={usuario.estado === 'bloqueado'}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {usuario.estado === 'activo' ? 'Desactivar' : 
                   usuario.estado === 'inactivo' ? 'Activar' : 
                   'Usuario bloqueado'} usuario
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Eliminar usuario
                </Button>
              </CardContent>
            </Card>
            
            {/* Tarjeta de permisos */}
            <Card>
              <CardHeader>
                <CardTitle>Permisos asignados</CardTitle>
              </CardHeader>
              <CardContent>
                {usuario.roles.length > 0 ? (
                  <ul className="space-y-3">
                    {usuario.roles.map(rolUsuario => {
                      const rolInfo = roles.find(r => r.id === rolUsuario.id);
                      return (
                        <li key={rolUsuario.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                          <span className="flex-1 text-sm">{rolInfo?.nombre}</span>
                          <Badge variant="outline" className="bg-muted/50">
                            Activo
                          </Badge>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-center p-4">
                    <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hay permisos asignados</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Tarjeta de historial */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historialEstados && historialEstados.length > 0 ? (
                    historialEstados.map((registro) => (
                      <div key={registro.id} className="flex items-start gap-3">
                        <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                          <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getIconForAction(registro.tipoAccion)}
                            <Badge variant="outline" className="capitalize">
                              {registro.tipoAccion.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{getActionDescription(registro)}</p>
                          {registro.motivoCambio && (
                            <p className="text-sm text-muted-foreground">Motivo: {registro.motivoCambio}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {registro.fechaHoraCambio.toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span>•</span>
                            <span>Por: {registro.realizadoPor.nombre} {registro.realizadoPor.apellido}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No hay registros en el historial
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar usuario */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <span className="font-semibold">{usuario.nombre} {usuario.apellido}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleEliminarUsuario}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para asignar rol */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Asignar rol</AlertDialogTitle>
            <AlertDialogDescription>
              {usuario?.estado === 'bloqueado' ? (
                <div className="text-destructive">
                  No se puede cambiar el rol de un usuario bloqueado
                </div>
              ) : (
                `Selecciona el nuevo rol para el usuario ${usuario?.nombre} ${usuario?.apellido}`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <RoleSelector
              userId={usuario?.id || ''}
              currentRoleId={usuario?.roles?.[0]?.id || ''}
              onRoleChange={handleRoleChange}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DetalleUsuario;
