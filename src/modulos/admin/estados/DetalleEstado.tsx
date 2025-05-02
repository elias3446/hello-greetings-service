import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  File, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  History, 
  Edit, 
  ArrowLeft, 
  Trash,
  Info,
  Clock
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { EstadoReporte } from '@/types/tipos';
import { getEstadoById, deleteEstado } from '@/controller/CRUD/estadoController';
import { Separator } from '@/components/ui/separator';

const DetalleEstado = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<EstadoReporte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEstado = () => {
      try {
        if (!id) {
          toast.error('ID de estado no válido');
          navigate('/admin/estados');
          return;
        }
        
        const estadoEncontrado = getEstadoById(id);
        
        if (!estadoEncontrado) {
          toast.error('Estado no encontrado');
          navigate('/admin/estados');
          return;
        }
        
        setEstado(estadoEncontrado);
      } catch (error) {
        console.error('Error al cargar el estado:', error);
        toast.error('Error al cargar el estado');
      } finally {
        setLoading(false);
      }
    };
    
    cargarEstado();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/admin/estados/${id}/editar`);
  };

  const handleDelete = () => {
    if (id) {
      try {
        const success = deleteEstado(id);
        if (success) {
          toast.success('Estado eliminado correctamente');
          navigate('/admin/estados');
        } else {
          toast.error('No se pudo eliminar el estado');
        }
      } catch (error) {
        console.error('Error al eliminar estado:', error);
        toast.error('Error al eliminar el estado');
      }
    }
  };

  if (loading) {
    return (
      <Layout titulo="Cargando estado...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!estado) {
    return (
      <Layout titulo="Estado no encontrado">
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Estado no encontrado</h2>
          <p className="text-muted-foreground mb-6">No se pudo encontrar el estado solicitado</p>
          <Button asChild>
            <Link to="/admin/estados">Volver a la lista</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Encabezado con breadcrumbs y botón de regreso */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center">
              <Link to="/admin/estados" className="hover:underline flex items-center">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Estados
              </Link>
              <span className="mx-2">/</span>
              <span>Detalle</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{estado.nombre}</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" /> Eliminar
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del estado */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-muted p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${estado.nombre}&background=random&size=100`} alt="Avatar" />
                    <AvatarFallback>{estado.nombre.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">{estado.nombre}</h3>
                      <Badge 
                        style={{ backgroundColor: estado.color }} 
                        className="ml-2"
                      >
                        {estado.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Info className="h-4 w-4 mr-2" />
                      {estado.tipo}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="info" className="p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="usage">Uso</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-6">
                  {/* Detalles principales */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
                      <p>{estado.descripcion || 'Sin descripción'}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Nombre</h4>
                        <div className="font-medium">{estado.nombre}</div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado actual</h4>
                        <Badge style={{ backgroundColor: estado.activo ? 'green' : 'gray', color: "white" }}>
                          {estado.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de creación</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {estado.fechaCreacion.toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Tipo</h4>
                        <Badge variant="outline" className="font-normal">
                          {estado.tipo}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Color</h4>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-5 w-5 rounded-full" 
                            style={{ backgroundColor: estado.color }}
                          />
                          <span className="font-medium">{estado.color}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Icono</h4>
                        <div className="flex items-center gap-2">
                          {estado.icono === 'check-circle' && <CheckCircle className="h-5 w-5" />}
                          {estado.icono === 'alert-triangle' && <AlertTriangle className="h-5 w-5" />}
                          {estado.icono === 'clock' && <Clock className="h-5 w-5" />}
                          {estado.icono === 'x-circle' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                          <span className="font-medium">{estado.icono}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Uso en reportes</h4>
                    <div className="p-4 rounded-md border">
                      <div className="text-center">
                        <File className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="font-medium">Usado en múltiples reportes</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Este estado se aplica a los reportes con el estado {estado.nombre.toLowerCase()}.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Historial de cambios</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                          <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <div className="space-y-1">
                          <Badge>Creado</Badge>
                          <p className="text-sm">{estado.fechaCreacion.toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                    </div>
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
                <CardDescription>Opciones para gestionar este estado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar estado
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.success('Acción de prueba ejecutada')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Cambiar visibilidad
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Eliminar estado
                </Button>
              </CardContent>
            </Card>
            
            {/* Tarjeta de información adicional */}
            <Card>
              <CardHeader>
                <CardTitle>Información adicional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tipo de estado</p>
                    <p className="font-medium">{estado.tipo}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Identificador</p>
                    <p className="font-medium text-xs">{estado.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tarjeta de estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reportes actualmente</span>
                    <Badge variant="outline">0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Última actualización</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  ID: {estado.id}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleEstado;
