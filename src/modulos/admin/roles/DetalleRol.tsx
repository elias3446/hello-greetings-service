import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { permisosDisponibles } from '@/data/permisos';
import { getRoleById, updateRole } from '@/controller/roleController';
import { getUsers } from '@/controller/userController';
import { 
  ArrowLeft, 
  Edit, 
  Shield, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  History, 
  Check, 
  X, 
  Pencil, 
  Trash2, 
  Users, 
  User,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Permiso, Usuario } from '@/types/tipos';

const DetalleRol = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const rol = id ? getRoleById(id) : null;
  
  // Obtener usuarios con este rol
  const todosUsuarios = getUsers();
  const usuariosConRol = todosUsuarios.filter(user => 
    user.roles.some(userRole => userRole.id === id)
  );
  
  if (!rol) {
    return (
      <Layout titulo="Detalle de Rol">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>El rol solicitado no existe o ha sido eliminado.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => navigate('/admin/roles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Button>
        </div>
      </Layout>
    );
  }

  const handleEdit = () => {
    navigate(`/admin/roles/${id}/editar`);
  };

  const handleDelete = () => {
    // Implementación pendiente
    toast.error('Función en desarrollo');
  };

  const toggleEstado = async () => {
    try {
      setIsLoading(true);
      const nuevoEstado = !rol.activo;
      
      await updateRole(rol.id, {
        activo: nuevoEstado
      });
      
      toast.success(`Rol ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
      // Recargar la página para ver los cambios
      navigate(0);
    } catch (error) {
      console.error('Error al cambiar el estado del rol:', error);
      toast.error('Error al cambiar el estado del rol');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsignarPermisos = () => {
    toast.success('Asignación de permisos en desarrollo');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Encabezado con breadcrumbs y botón de regreso */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center">
              <Link to="/admin/roles" className="hover:underline flex items-center">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Roles
              </Link>
              <span className="mx-2">/</span>
              <span>Detalle</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{rol.nombre}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to={`/admin/roles/${id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Rol
              </Link>
            </Button>
            <Button 
              variant={rol.activo ? 'destructive' : 'default'}
              onClick={toggleEstado}
              disabled={isLoading}
            >
              {rol.activo ? 'Desactivar' : 'Activar'} Rol
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del rol */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-muted p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarFallback style={{ backgroundColor: rol.color || '#3B82F6' }}>
                      {rol.nombre.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">{rol.nombre}</h3>
                      <Badge 
                        className="ml-2"
                        variant={rol.activo ? 'default' : 'secondary'}
                      >
                        {rol.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Shield className="h-4 w-4 mr-2" />
                      {rol.tipo === 'admin' ? 'Administrativo' : 'Usuario'}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="info" className="p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="permisos">Permisos</TabsTrigger>
                  <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-6">
                  {/* Detalles principales */}
                  <div className="space-y-4">
                    {rol.descripcion && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
                        <p className="text-sm">{rol.descripcion}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado actual</h4>
                        <Badge variant={rol.activo ? 'success' : 'inactive'}>
                          {rol.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de creación</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(rol.fechaCreacion).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {rol.fechaActualizacion && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Última actualización</h4>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(rol.fechaActualizacion).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información del tipo de rol */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Información del rol</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Tipo</p>
                          <p className="font-medium">{rol.tipo === 'admin' ? 'Administrativo' : 'Usuario'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3" style={{ color: rol.color || '#3B82F6' }}>
                        <div className="h-5 w-5 rounded-full" style={{ backgroundColor: rol.color || '#3B82F6' }}></div>
                        <div>
                          <p className="text-sm text-gray-500">Color</p>
                          <p className="font-medium">{rol.color || '#3B82F6'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="permisos" className="space-y-4">
                  <h4 className="text-base font-medium mb-4">Permisos asignados</h4>
                  {rol.permisos && rol.permisos.length > 0 ? (
                    <div className="space-y-2">
                      {rol.permisos.map((permiso, index) => {
                        // Si permiso es un string (ID), buscamos el objeto Permiso correspondiente
                        let permisoObj;
                        if (typeof permiso === 'string') {
                          permisoObj = permisosDisponibles.find(p => p.id === permiso);
                        } else {
                          // Si permiso es un objeto Permiso, lo usamos directamente
                          permisoObj = permiso;
                        }
                        
                        return permisoObj ? (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/20">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div className="space-y-1">
                              <p className="font-medium">{permisoObj.nombre}</p>
                              <p className="text-sm text-muted-foreground">{permisoObj.descripcion}</p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No hay permisos asignados</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="usuarios" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-medium">Usuarios con este rol ({usuariosConRol.length})</h4>
                    <Link to="/admin/usuarios/crear">
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Nuevo usuario
                      </Button>
                    </Link>
                  </div>
                  
                  {usuariosConRol.length > 0 ? (
                    <Card>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="w-[100px]">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usuariosConRol.map((usuario) => (
                            <TableRow key={usuario.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    {usuario.avatar ? (
                                      <AvatarImage src={usuario.avatar} alt={`${usuario.nombre} ${usuario.apellido}`} />
                                    ) : (
                                      <AvatarFallback>
                                        {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {usuario.tipo === 'admin' ? 'Administrador' : 'Usuario'}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {usuario.email}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={usuario.estado === 'activo' ? 'outline' : 'secondary'}
                                  className={`${usuario.estado === 'activo' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}`}
                                >
                                  {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    asChild
                                  >
                                    <Link to={`/admin/usuarios/${usuario.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    asChild
                                  >
                                    <Link to={`/admin/usuarios/${usuario.id}/editar`}>
                                      <Pencil className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed">
                      <Users className="h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="font-medium text-lg mb-1">No hay usuarios con este rol</h3>
                      <p className="text-muted-foreground mb-4">No se han asignado usuarios a este rol todavía.</p>
                      <Button variant="outline" asChild>
                        <Link to="/admin/usuarios/crear">
                          <User className="h-4 w-4 mr-2" />
                          Crear usuario
                        </Link>
                      </Button>
                    </div>
                  )}
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
                <CardDescription>Opciones para gestionar este rol</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={`/admin/roles/${id}/editar`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar rol
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleAsignarPermisos}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Asignar permisos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={toggleEstado}
                  disabled={isLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {rol.activo ? 'Desactivar' : 'Activar'} rol
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Eliminar rol
                </Button>
              </CardContent>
            </Card>
            
            {/* Tarjeta de usuarios con este rol */}
            <Card>
              <CardHeader>
                <CardTitle>Usuarios con este rol</CardTitle>
                <CardDescription>Hay {usuariosConRol.length} usuarios con este rol</CardDescription>
              </CardHeader>
              <CardContent>
                {usuariosConRol.length > 0 ? (
                  <div className="space-y-3">
                    {usuariosConRol.slice(0, 5).map((usuario) => (
                      <div key={usuario.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/20">
                        <Avatar className="h-10 w-10">
                          {usuario.avatar ? (
                            <AvatarImage src={usuario.avatar} alt={`${usuario.nombre} ${usuario.apellido}`} />
                          ) : (
                            <AvatarFallback>
                              {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{usuario.nombre} {usuario.apellido}</p>
                          <p className="text-xs text-muted-foreground truncate">{usuario.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/usuarios/${usuario.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                    
                    {usuariosConRol.length > 5 && (
                      <div className="text-center pt-2">
                        <Button variant="link" size="sm" asChild>
                          <Link to={`/admin/usuarios?rol=${id}`}>
                            Ver todos los usuarios ({usuariosConRol.length})
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hay usuarios con este rol</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Tarjeta de permisos */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de permisos</CardTitle>
              </CardHeader>
              <CardContent>
                {rol.permisos && rol.permisos.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-primary/20 text-primary font-semibold text-sm py-1 px-2 rounded-md">
                        {rol.permisos.length} {rol.permisos.length === 1 ? 'permiso' : 'permisos'} asignados
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {rol.permisos.slice(0, 5).map((permiso, index) => {
                        // Si permiso es un string (ID), buscamos el objeto Permiso correspondiente
                        let permisoNombre = '';
                        if (typeof permiso === 'string') {
                          const permisoObj = permisosDisponibles.find(p => p.id === permiso);
                          permisoNombre = permisoObj ? permisoObj.nombre : permiso;
                        } else {
                          // Si permiso es un objeto Permiso, usamos su nombre directamente
                          permisoNombre = permiso.nombre;
                        }
                        
                        return (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-3.5 w-3.5 text-green-500" />
                            <span>{permisoNombre}</span>
                          </li>
                        );
                      })}
                      {rol.permisos.length > 5 && (
                        <li className="text-sm text-muted-foreground pt-1">
                          Y {rol.permisos.length - 5} más...
                        </li>
                      )}
                    </ul>
                  </div>
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
                      <p className="text-sm">{new Date(rol.fechaCreacion).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  
                  {rol.fechaActualizacion && (
                    <div className="flex items-start gap-3">
                      <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                        <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="space-y-1">
                        <Badge>Actualizado</Badge>
                        <p className="text-sm">{new Date(rol.fechaActualizacion).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                      <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div className="space-y-1">
                      <Badge className={rol.activo ? 'bg-green-500' : 'bg-gray-500'}>
                        {rol.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <p className="text-sm">Estado actual</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetalleRol;
