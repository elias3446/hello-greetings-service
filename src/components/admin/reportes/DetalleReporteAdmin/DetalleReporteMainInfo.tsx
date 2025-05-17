import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, MapPin, User } from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ReporteActividad from '@/components/reportes/ReporteActividad';
import type { Reporte } from '@/types/tipos';
import MapaReporteEspecifico from '@/components/MapaBase/MapaReporteEspecifico';

interface DetalleReporteMainInfoProps {
  reporte: Reporte;
}

const DetalleReporteMainInfo: React.FC<DetalleReporteMainInfoProps> = ({ reporte }) => (
  <div className="md:col-span-2 space-y-6">
    <Card className="overflow-hidden">
      <div className="bg-muted p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">{reporte.titulo}</h3>
              <Badge style={{ backgroundColor: reporte.estado.color }} className="ml-2">
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
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
              <p>{reporte.descripcion}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Categoría</h4>
                <div className="flex items-center gap-2">
                  {reporte.categoria ? (
                    <Badge style={{ backgroundColor: reporte.categoria.color, color: 'white' }}>
                      {reporte.categoria.nombre}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Sin categoría</Badge>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado actual</h4>
                <Badge style={{ backgroundColor: reporte.estado.color, color: 'white' }}>
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
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Prioridad</h4>
                {reporte.prioridad ? (
                  <Badge style={{ backgroundColor: reporte.prioridad.color, color: 'white' }}>
                    {reporte.prioridad.nombre}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">No asignada</span>
                )}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Ubicación</h4>
            <div className="h-[300px] rounded-md overflow-hidden border">
            <MapaReporteEspecifico 
              reporte={reporte} 
              height="h-[600px]" 
            />
            </div>
          </div>
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
                              minute: '2-digit',
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
        </TabsContent>
        <TabsContent value="activity">
          <ReporteActividad reporte={reporte} />
        </TabsContent>
      </Tabs>
    </Card>
  </div>
);

export default DetalleReporteMainInfo; 