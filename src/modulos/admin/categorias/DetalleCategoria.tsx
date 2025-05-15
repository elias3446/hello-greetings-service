import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, Edit, ArrowLeft, FileText, CheckCircle, AlertTriangle, User, MapPin, Info, History } from 'lucide-react';
import { getCategoryById, getReportesPorCategoria } from '@/controller/CRUD/category/categoryController';
import { toast } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { filterReports } from '@/controller/CRUD/report/reportController';
import { actividadesCategoria } from '@/data/actividades';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import ActividadItem from '@/components/layout/ActividadItem';
import { getHistorialEstadosCategoria } from '@/controller/CRUD/category/historialEstadosCategoria';
import { eliminarReporte } from '@/controller/controller/report/reportDeleteController';
import { getSystemUser } from '@/utils/userUtils';
import { deleteCategoryAndUpdateHistory } from '@/controller/controller/category/categoryDeleteController';
import { actualizarEstadoCategoria } from '@/controller/controller/category/actualizarEstadoCategoria';
import { Icons } from '@/components/Icons';

const DetalleCategoria = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState<any>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [contadorReportes, setContadorReportes] = useState<number>(0);
  const [reportesAsociados, setReportesAsociados] = useState<any[]>([]);
  const [actividadesList, setActividadesList] = useState<any[]>([]);
  const [estadisticasEstados, setEstadisticasEstados] = useState<{[key: string]: number}>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("info");
  const [historialEstados, setHistorialEstados] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      // Cargar datos de la categoría
      const categoriaEncontrada = getCategoryById(id);
      if (categoriaEncontrada) {
        setCategoria(categoriaEncontrada);
        
        // Obtener reportes asociados a esta categoría
        const reportes = filterReports({ categoryId: id });
        setReportesAsociados(reportes.slice(0, 3)); // Mostrar los primeros 3 reportes
        setContadorReportes(reportes.length);
        
        // Obtener actividades de esta categoría
        const actividades = actividadesCategoria.filter(act => act.categoriaId === id);
        setActividadesList(actividades);
        
        // Calcular estadísticas por estado
        const estados = getEstados();
        const estadisticas: {[key: string]: number} = {};
        
        // Inicializar contador para cada estado
        estados.forEach(estado => {
          estadisticas[estado.id] = 0;
        });
        
        // Contar reportes por estado
        reportes.forEach(reporte => {
          if (estadisticas[reporte.estado.id] !== undefined) {
            estadisticas[reporte.estado.id]++;
          }
        });
        
        setEstadisticasEstados(estadisticas);

        // Obtener historial de estados
        const historial = getHistorialEstadosCategoria(id);
        setHistorialEstados(historial);
      } else {
        toast.error('Categoría no encontrada');
        navigate('/admin/categorias');
      }
      setCargando(false);
    }
  }, [id, navigate]);

  const actualizarDatosCategoria = () => {
    if (!id) return;

    // Obtener reportes asociados a esta categoría
    const reportes = filterReports({ categoryId: id });
    setReportesAsociados(reportes.slice(0, 3)); // Mostrar los primeros 3 reportes
    setContadorReportes(reportes.length);
    
    // Calcular estadísticas por estado
    const estados = getEstados();
    const estadisticas: {[key: string]: number} = {};
    
    // Inicializar contador para cada estado
    estados.forEach(estado => {
      estadisticas[estado.id] = 0;
    });
    
    // Contar reportes por estado
    reportes.forEach(reporte => {
      if (estadisticas[reporte.estado.id] !== undefined) {
        estadisticas[reporte.estado.id]++;
      }
    });
    
    setEstadisticasEstados(estadisticas);
  };

  const handleEliminar = async () => {
    try {
      const systemUser = getSystemUser();
      const resultado = await deleteCategoryAndUpdateHistory(id!, systemUser);
      
      if (resultado.success) {
        toast.success(resultado.message);
        if (resultado.affectedReports && resultado.affectedReports > 0) {
          toast.info(`${resultado.affectedReports} reportes fueron actualizados a "Sin categoría"`);
        }
        navigate('/admin/categorias');
      } else {
        toast.error(resultado.message);
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      toast.error('Error al eliminar la categoría');
    }
  };

  const handleMarkInactiva = async () => {
    try {
      const systemUser = getSystemUser();
      const success = await actualizarEstadoCategoria(
        categoria,
        false,
        systemUser,
        'Desactivación manual por administrador'
      );

      if (success) {
        setCategoria(prev => ({ ...prev, activo: false }));
        // Actualizar el historial después del cambio
        const historial = getHistorialEstadosCategoria(id!);
        setHistorialEstados(historial);
        // Actualizar estadísticas y reportes
        actualizarDatosCategoria();
        toast.success('Categoría desactivada correctamente');
      }
    } catch (error) {
      console.error('Error al desactivar la categoría:', error);
      toast.error('Error al desactivar la categoría');
    }
  };

  const handleMarkActiva = async () => {
    try {
      const systemUser = getSystemUser();
      const success = await actualizarEstadoCategoria(
        categoria,
        true,
        systemUser,
        'Activación manual por administrador'
      );

      if (success) {
        setCategoria(prev => ({ ...prev, activo: true }));
        // Actualizar el historial después del cambio
        const historial = getHistorialEstadosCategoria(id!);
        setHistorialEstados(historial);
        // Actualizar estadísticas y reportes
        actualizarDatosCategoria();
        toast.success('Categoría activada correctamente');
      }
    } catch (error) {
      console.error('Error al activar la categoría:', error);
      toast.error('Error al activar la categoría');
    }
  };

  const handleVerReportes = () => {
    navigate('/admin/reportes', { 
      state: { 
        categoryFilter: id,
        initialFilters: {
          categoria: [id]
        }
      }
    });
  };

  if (cargando) {
    return (
      <Layout titulo="Cargando categoría...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!categoria) {
    return (
      <Layout titulo="Error">
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Categoría no encontrada</h2>
          <p className="text-muted-foreground mb-6">No se pudo encontrar la categoría solicitada</p>
          <Button asChild>
            <Link to="/admin/categorias">Volver a la lista</Link>
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
              <Link to="/admin/categorias" className="hover:underline flex items-center">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Categorías
              </Link>
              <span className="mx-2">/</span>
              <span>Detalle</span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información de la categoría */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-muted p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {categoria.icono && Icons[categoria.icono.charAt(0).toUpperCase() + categoria.icono.slice(1)]
                    ? React.createElement(
                        Icons[categoria.icono.charAt(0).toUpperCase() + categoria.icono.slice(1)],
                        { size: 64, color: categoria.color }
                      )
                    : (
                        <span className="text-3xl font-bold" style={{ color: categoria.color }}>
                          {categoria.nombre.substring(0, 2).toUpperCase()}
                        </span>
                      )
                  }
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">{categoria.nombre}</h3>
                      <Badge 
                        className={categoria.activo ? "bg-green-500" : "bg-gray-500"}
                      >
                        {categoria.activo ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Info className="h-4 w-4 mr-2" />
                      {categoria.descripcion.substring(0, 80)}...
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="info" className="p-6" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="activity">Actividad</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-6">
                  {/* Detalles principales */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
                      <p>{categoria.descripcion}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Color de la categoría</h4>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full" 
                            style={{ backgroundColor: categoria.color }}
                          ></div>
                          <span>{categoria.color}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado actual</h4>
                        <Badge className={categoria.activo ? "bg-green-500" : "bg-gray-500"}>
                          {categoria.activo ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de creación</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(categoria.fechaCreacion).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Reportes asociados</h4>
                        <Badge variant="outline">{contadorReportes} reportes</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Información del creador */}
                  {categoria.usuarioCreador && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Creada por</h4>
                      <div className="flex items-center gap-4 p-4 rounded-md border">
                        <Avatar>
                          <AvatarImage src="" alt="Avatar" />
                          <AvatarFallback>
                            {categoria.usuarioCreador.nombre.charAt(0)}{categoria.usuarioCreador.apellido.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {categoria.usuarioCreador.nombre} {categoria.usuarioCreador.apellido}
                          </div>
                          <div className="text-sm text-muted-foreground">{categoria.usuarioCreador.email}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reportes relacionados */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Reportes relacionados</h4>
                    {reportesAsociados.length > 0 ? (
                      <div className="space-y-2">
                        {reportesAsociados.map(reporte => (
                          <div key={reporte.id} className="flex items-center justify-between p-4 border rounded-md">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-medium">{reporte.titulo}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600"
                              onClick={() => navigate(`/admin/reportes/${reporte.id}`)}
                            >
                              Ver
                            </Button>
                          </div>
                        ))}
                        
                        {contadorReportes > 3 && (
                          <div className="text-center pt-2">
                            <Button 
                              variant="ghost" 
                              className="text-blue-600"
                              onClick={handleVerReportes}
                            >
                              Ver todos los reportes ({contadorReportes})
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-6 border rounded-md bg-muted/50">
                        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No hay reportes asociados a esta categoría</p>
                      </div>
                    )}
                  </div>

                  {/* Estadísticas */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Estadísticas por estado</h4>
                    {contadorReportes > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(estadisticasEstados).map(([estadoId, cantidad]) => {
                          const estado = getEstados().find(e => e.id === estadoId);
                          if (!estado || cantidad === 0) return null;
                          
                          return (
                            <div key={estadoId} className="border rounded-md p-4">
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: estado.color }}></div>
                                  <span className="font-medium">{estado.nombre}</span>
                                </div>
                                <span className="text-2xl font-bold">{cantidad}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md">
                        <p className="text-muted-foreground">No hay datos estadísticos disponibles</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Actividad de la Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {actividadesList.length > 0 ? (
                        <div className="space-y-6">
                          {actividadesList.map((actividad) => (
                            <ActividadItem key={actividad.id} actividad={actividad} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <History className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No hay actividad registrada para esta categoría</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
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
                <CardDescription>Opciones para gestionar esta categoría</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/categorias/${id}/editar`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar categoría
                </Button>
                {categoria.activo ? (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleMarkInactiva}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Desactivar categoría
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleMarkActiva}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activar categoría
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleVerReportes}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Ver reportes asociados
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Eliminar categoría
                </Button>
              </CardContent>
            </Card>
            
            {/* Tarjeta de estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de reportes:</span>
                    <span className="font-bold">{contadorReportes}</span>
                  </div>
                  
                  {Object.entries(estadisticasEstados).map(([estadoId, cantidad]) => {
                    const estado = getEstados().find(e => e.id === estadoId);
                    if (!estado || cantidad === 0) return null;
                    
                    return (
                      <div key={estadoId} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: estado.color }}></div>
                          <span className="text-gray-600">Reportes {estado.nombre}:</span>
                        </div>
                        <span className="font-bold">{cantidad}</span>
                      </div>
                    );
                  })}
                  
                  {contadorReportes === 0 && (
                    <p className="text-gray-500 text-center py-4">No hay reportes para esta categoría</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Tarjeta de historial */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de cambios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historialEstados.length > 0 ? (
                    [...historialEstados]
                      .sort((a, b) => new Date(b.fechaHoraCambio).getTime() - new Date(a.fechaHoraCambio).getTime())
                      .map((historial, index) => (
                      <div key={historial.id} className="flex items-start gap-3">
                        <div className="min-w-[2px] h-full bg-muted-foreground/30 relative">
                          <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <div className="space-y-1">
                          <Badge>{historial.tipoAccion === 'cambio_estado' ? 'Cambio de estado' : historial.tipoAccion}</Badge>
                          <p className="text-sm">
                            {historial.estadoAnterior ? `De: ${historial.estadoAnterior}` : 'Creado'} 
                            {historial.estadoNuevo ? ` → ${historial.estadoNuevo}` : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(historial.fechaHoraCambio).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {historial.motivoCambio && (
                            <p className="text-xs text-muted-foreground italic">
                              Motivo: {historial.motivoCambio}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Por: {historial.realizadoPor.nombre} {historial.realizadoPor.apellido}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No hay historial de cambios registrado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogo de confirmación para eliminar */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro de que quieres eliminar esta categoría?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría "{categoria.nombre}" y todos sus datos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleEliminar}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetalleCategoria;
