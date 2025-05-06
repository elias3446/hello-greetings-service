import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, File, Calendar, CheckCircle, AlertTriangle, User, History, Edit, ArrowLeft, FileText, Clock } from 'lucide-react';
import { getReportById } from '@/controller/CRUD/reportController';
import { obtenerHistorialReporte, registrarCambioEstado } from '@/controller/CRUD/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';
import type { Reporte, HistorialEstadoReporte } from '@/types/tipos';
import MapaBase from '@/components/layout/MapaBase';
import { ReporteAcciones } from '@/components/reportes/ReporteAcciones';
import ReporteActividad from '@/components/reportes/ReporteActividad';

const DetalleReporte = () => {
  const { id } = useParams<{ id: string }>();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [historialEstados, setHistorialEstados] = useState<HistorialEstadoReporte[]>([]);

  useEffect(() => {
    const cargarReporte = () => {
      try {
        if (!id) {
          toast.error('ID de reporte no válido');
          navigate('/admin/reportes');
          return;
        }
        
        const reporteEncontrado = getReportById(id);
        
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

  const handleMarkResolved = () => {
    toast.success('Reporte marcado como Resuelto');
  };

  const getIconForAction = (tipoAccion: string) => {
    switch (tipoAccion) {
      case 'creacion':
        return <FileText className="h-4 w-4" />;
      case 'cambio_estado':
        return <CheckCircle className="h-4 w-4" />;
      case 'asignacion_reporte':
        return <User className="h-4 w-4" />;
      case 'actualizacion':
        return <Edit className="h-4 w-4" />;
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
        return 'Reporte asignado';
      case 'actualizacion':
        return 'Información actualizada';
      default:
        return 'Acción realizada';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Encabezado con breadcrumbs y botón de regreso */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center">
              <Link to="/admin/reportes" className="hover:underline flex items-center">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Reportes
              </Link>
              <span className="mx-2">/</span>
              <span>Detalle</span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del reporte */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-muted p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarImage src="https://via.placeholder.com/100" alt="Avatar" />
                    <AvatarFallback>{reporte.categoria.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">{reporte.titulo}</h3>
                      <Badge 
                        style={{ backgroundColor: reporte.estado.color }} 
                        className="ml-2"
                      >
                        {reporte.estado.nombre}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {reporte.ubicacion.direccion}
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
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
                      <p>{reporte.descripcion}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Categoría</h4>
                        <div className="flex items-center gap-2">
                          <Badge style={{ backgroundColor: reporte.categoria.color, color: "white" }}>
                            {reporte.categoria.nombre}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado actual</h4>
                        <Badge style={{ backgroundColor: reporte.estado.color, color: "white" }}>
                          {reporte.estado.nombre}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de creación</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {reporte.fechaCreacion.toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Prioridad</h4>
                        {reporte.prioridad ? (
                          <Badge style={{ backgroundColor: reporte.prioridad.color, color: "white" }}>
                            {reporte.prioridad.nombre}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">No asignada</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Información de ubicación */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Ubicación</h4>
                    <div className="h-[300px] rounded-md overflow-hidden border">
                      <MapaBase
                        reportes={[reporte]}
                        altura="300px"
                        initialPosition={[reporte.ubicacion.latitud, reporte.ubicacion.longitud]}
                        forceInitialPosition={true}
                      />
                    </div>
                  </div>

                  {/* Información del creador */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Reportado por</h4>
                    <div className="flex items-center gap-4 p-4 rounded-md border">
                      <Avatar>
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${reporte.usuarioCreador.nombre}+${reporte.usuarioCreador.apellido}&background=random`} alt="Avatar" />
                        <AvatarFallback>{reporte.usuarioCreador.nombre.charAt(0)}{reporte.usuarioCreador.apellido.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{reporte.usuarioCreador.nombre} {reporte.usuarioCreador.apellido}</div>
                        <div className="text-sm text-muted-foreground">{reporte.usuarioCreador.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Información del asignado */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Historial de asignaciones</h4>
                    <div className="space-y-4">
                      {reporte.historialAsignaciones && reporte.historialAsignaciones.length > 0 ? (
                        <div className="space-y-4">
                          {reporte.historialAsignaciones.map((asignacion) => (
                            <div key={asignacion.id} className={`flex items-start gap-4 p-4 rounded-md border ${
                              asignacion.esActual ? 'bg-primary/5 border-primary' : ''
                            }`}>
                              <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                                <div className={`absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full ${
                                  asignacion.esActual ? 'bg-primary' : 'bg-muted-foreground'
                                }`}></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  {asignacion.usuario ? (
                                    <>
                                      <Avatar>
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${asignacion.usuario.nombre}+${asignacion.usuario.apellido}&background=random`} alt="Avatar" />
                                        <AvatarFallback>{asignacion.usuario.nombre.charAt(0)}{asignacion.usuario.apellido.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium flex items-center gap-2">
                                          {asignacion.usuario.nombre} {asignacion.usuario.apellido}
                                          {asignacion.esActual && <Badge variant="default">Actual</Badge>}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {asignacion.usuario.email}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <Avatar>
                                        <AvatarFallback className="bg-muted">NA</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium flex items-center gap-2">
                                          Sin responsable
                                          {asignacion.esActual && <Badge variant="default">Actual</Badge>}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {asignacion.usuario === null ? 'Usuario eliminado' : 'Desasignado manualmente'}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="mt-2 space-y-1">
                                  <div className="flex flex-wrap gap-2">
                                    {asignacion.usuario?.estado === 'bloqueado' && (
                                      <Badge variant="destructive">Usuario bloqueado</Badge>
                                    )}
                                    {asignacion.usuario?.estado === 'inactivo' && (
                                      <Badge variant="secondary">Usuario inactivo</Badge>
                                    )}
                                    {asignacion.usuario === null && (
                                      <Badge variant="destructive">Usuario eliminado</Badge>
                                    )}
                                    {asignacion.usuario === undefined && (
                                      <Badge variant="secondary">Desasignado manualmente</Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {asignacion.usuario ? 'Asignado' : 'Desasignado'} el {asignacion.fechaAsignacion.toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 border rounded-md bg-muted/50">
                          <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No hay historial de asignaciones</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Imágenes adjuntas */}
                  {reporte.imagenes && reporte.imagenes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Imágenes</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {reporte.imagenes.map((imagen, idx) => (
                          <div key={idx} className="aspect-square rounded-md overflow-hidden border">
                            <img 
                              src={imagen} 
                              alt={`Imagen ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="activity">
                  <ReporteActividad reporte={reporte} />
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
                <CardDescription>Opciones para gestionar este reporte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start"
                onClick={() => navigate(`/admin/reportes/${reporte.id}/editar`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar reporte
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marcar como resuelto
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Reasignar
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Marcar como spam
                </Button>
              </CardContent>
            </Card>
            
            {/* Tarjeta de documentos adjuntos */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos adjuntos</CardTitle>
              </CardHeader>
              <CardContent>
                {reporte.imagenes && reporte.imagenes.length > 0 ? (
                  <ul className="space-y-3">
                    {reporte.imagenes.map((_, idx) => (
                      <li key={idx} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <File className="h-5 w-5 text-muted-foreground" />
                        <span className="flex-1 text-sm">Documento-{idx + 1}.jpg</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <History className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center p-4">
                    <File className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hay documentos adjuntos</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Tarjeta de historial */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de estados</CardTitle>
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
    </>
  );
};

export default DetalleReporte;
