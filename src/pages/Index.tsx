import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  CalendarDays,
  ArrowRight,
  MapPin,
  BarChart4,
  Users
} from 'lucide-react';
import { reportes } from '@/data/reportes';
import { estadosReporte } from '@/data/estadosReporte';

const iconosPorTipo: {[key: string]: any} = {
  pendiente: { icono: Clock, color: 'bg-yellow-100', textColor: '#FFD166' },
  en_progreso: { icono: BarChart3, color: 'bg-blue-100', textColor: '#118AB2' },
  completado: { icono: CheckCircle2, color: 'bg-green-100', textColor: '#06D6A0' },
  cancelado: { icono: CalendarDays, color: 'bg-red-100', textColor: '#EF476F' },
};

const Index = () => {
  const [reportesPorEstado, setReportesPorEstado] = useState<{
    [key: string]: {
      nombre: string;
      tipo: string;
      color: string;
      reportes: typeof reportes;
    }
  }>({});

  useEffect(() => {
    const reportesAgrupados = estadosReporte.reduce((acc, estado) => {
      const reportesFiltrados = reportes.filter(reporte => reporte.estado.id === estado.id);
      
      if (reportesFiltrados.length > 0) {
        acc[estado.id] = {
          nombre: estado.nombre,
          tipo: estado.nombre.toLowerCase().replace(/ /g, '_'),
          color: estado.color,
          reportes: reportesFiltrados
        };
      }
      
      return acc;
    }, {} as {[key: string]: any});

    setReportesPorEstado(reportesAgrupados);
  }, []);

  const totalReportes = reportes.length;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h1 className="text-3xl font-bold mb-2">Plataforma de Gestión de Reportes Georreferenciados</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Sistema para el mejoramiento, seguimiento y control de reportes basado en geolocalización
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/reportes/nuevo">
                <FileText className="h-5 w-5" />
                Crear Nuevo Reporte
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/mapa">
                <MapPin className="h-5 w-5" />
                Ver Mapa de Reportes
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reportes</p>
                <p className="text-2xl font-bold">{totalReportes}</p>
              </div>
            </CardContent>
          </Card>

          {Object.entries(reportesPorEstado).map(([estadoId, estado]) => {
            const estadoOriginal = estadosReporte.find(e => e.id === estadoId);
            const tipo = estadoOriginal?.nombre.toLowerCase().replace(/ /g, '_') || 'default';
            
            const iconoInfo = iconosPorTipo[tipo] || { 
              icono: FileText, 
              color: 'bg-gray-100', 
              textColor: '#555' 
            };
            
            const Icono = iconoInfo.icono;
            const colorFondo = iconoInfo.color;
            
            return (
              <Card key={estadoId}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`${colorFondo} p-3 rounded-full`}>
                    <Icono className="h-5 w-5" style={{ color: estado.color }} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reportes {estado.nombre}</p>
                    <p className="text-2xl font-bold">{estado.reportes.length}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <BarChart4 className="h-6 w-6 text-blue-700" />
              </div>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Panel de estadísticas y visualizaciones de reportes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Visualización de datos en tiempo real sobre reportes, estados y categorías.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard">
                  Ir al Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-green-700" />
              </div>
              <CardTitle>Mapa</CardTitle>
              <CardDescription>Visualización geográfica de reportes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Visualice todos los reportes en un mapa interactivo con filtraciones por categoría y estado.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/mapa">
                  Ver Mapa
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
              <CardTitle>Administración</CardTitle>
              <CardDescription>Gestión de usuarios, roles y configuraciones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Administre usuarios, roles, categorías y estados de reportes desde un solo lugar.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin">
                  Acceder
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(reportesPorEstado).map(([estadoId, estado]) => {
            return (
              <Card key={estadoId} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3">
                  <div>
                    <CardTitle className="text-lg">Reportes {estado.nombre}</CardTitle>
                    <CardDescription>Últimos reportes con estado {estado.nombre.toLowerCase()}</CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs py-1" 
                    style={{ backgroundColor: `${estado.color}20`, color: estado.color, borderColor: estado.color }}
                  >
                    {estado.reportes.length} reportes
                  </Badge>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="divide-y">
                    {estado.reportes.slice(0, 5).map((reporte) => (
                      <Link
                        key={reporte.id}
                        to={`/reportes/${reporte.id}`}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{reporte.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {reporte.ubicacion.direccion}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                          Ver <ArrowRight size={16} />
                        </Button>
                      </Link>
                    ))}
                    
                    {estado.reportes.length === 0 && (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">No hay reportes {estado.nombre.toLowerCase()}</p>
                      </div>
                    )}
                  </div>
                </CardContent>

                {estado.reportes.length > 5 && (
                  <div className="p-4 border-t bg-muted/20">
                    <Button asChild variant="ghost" className="w-full flex gap-1 justify-center">
                      <Link to="/reportes">Ver todos los reportes {estado.nombre.toLowerCase()}</Link>
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
