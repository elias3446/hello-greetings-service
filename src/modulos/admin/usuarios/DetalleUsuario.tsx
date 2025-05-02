
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '@/controller/userController';
import { roles } from '@/data/roles';
import { actividadesUsuario } from '@/data/actividades';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, PencilLine, Mail, Shield, Calendar, CheckCircle, AlertTriangle, User, History, Edit } from 'lucide-react';
import ActividadItem from '@/components/layout/ActividadItem';
import Layout from '@/components/layout/Layout';
import { toast } from '@/components/ui/sonner';

const DetalleUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
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
    toast.success('Rol actualizado correctamente');
  };

  const handleCambiarEstado = () => {
    toast.success('Estado actualizado correctamente');
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
            <h2 className="text-3xl font-bold tracking-tight">{usuario.nombre} {usuario.apellido}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to={`/admin/usuarios/${id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Usuario
              </Link>
            </Button>
            <Button variant={usuario.estado === 'activo' ? 'destructive' : 'default'}>
              {usuario.estado === 'activo' ? 'Desactivar' : 'Activar'} Usuario
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del usuario */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-muted p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarImage src="https://via.placeholder.com/100" alt="Avatar" />
                    <AvatarFallback>{usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">{usuario.nombre} {usuario.apellido}</h3>
                      <Badge 
                        className="ml-2"
                        variant={usuario.estado === 'activo' ? 'default' : 'secondary'}
                      >
                        {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {usuario.email}
                    </div>
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
                        <Badge variant={usuario.estado === 'activo' ? 'default' : 'secondary'}>
                          {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
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

                  {/* Información de actividad reciente */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Actividad reciente</h4>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        {actividadesDelUsuario.length > 0 ? (
                          <div className="space-y-4">
                            {actividadesDelUsuario.slice(0, 3).map((actividad) => (
                              <ActividadItem key={actividad.id} actividad={actividad} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground">No hay actividad reciente</p>
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
                  onClick={handleAsignarRol}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Asignar rol
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleCambiarEstado}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {usuario.estado === 'activo' ? 'Desactivar' : 'Activar'} usuario
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
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
                  <div className="flex items-start gap-3">
                    <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                      <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div className="space-y-1">
                      <Badge>Creado</Badge>
                      <p className="text-sm">{new Date(usuario.fechaCreacion).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                      <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div className="space-y-1">
                      <Badge className={usuario.estado === 'activo' ? 'bg-green-500' : 'bg-gray-500'}>
                        {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <p className="text-sm">{new Date().toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleUsuario;
