import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getReportById, createReport } from '@/controller/CRUD/reportController';
import { getCategories } from '@/controller/CRUD/categoryController';
import { getEstados } from '@/controller/CRUD/estadoController';
import { getUsers } from '@/controller/CRUD/userController';
import { prioridades } from '@/data/categorias';
import MapaSeleccionUbicacion from '@/components/reportes/MapaSeleccionUbicacion';
import type { Reporte, Ubicacion, Usuario } from '@/types/tipos';
import { ArrowLeft, Edit, X, Map, Calendar, User, ClipboardList } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { actualizarReporte } from '@/controller/controller/reportUpdateController';
import ImageUploader from '@/components/ui/ImageUploader';

interface FormularioReporteAdminProps {
  modo: 'crear' | 'editar';
}

// Esquema para validar el formulario
const formSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  categoriaId: z.string().min(1, 'La categoría es obligatoria'),
  estadoId: z.string().min(1, 'El estado es obligatorio'),
  prioridadId: z.string().optional(),
  asignadoId: z.string().optional(),
  activo: z.boolean().default(true),
});

const FormularioReporteAdmin: React.FC<FormularioReporteAdminProps> = ({ modo }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [imagenes, setImagenes] = useState<File[]>([]);

  // Configurar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      categoriaId: '',
      estadoId: '',
      prioridadId: '',
      asignadoId: '',
      activo: true,
    },
  });

  // Handler para actualizar la ubicación
  const handleUbicacionSeleccionada = (ubicacionData: {
    latitud: number;
    longitud: number;
    direccion: string;
    referencia: string;
    id?: string;
    fechaCreacion?: Date;
    activo?: boolean;
  }) => {
    // Asegurar que tenga todos los campos requeridos para el tipo Ubicacion
    const nuevaUbicacion: Ubicacion = {
      id: ubicacionData.id || crypto.randomUUID(),
      latitud: ubicacionData.latitud,
      longitud: ubicacionData.longitud,
      direccion: ubicacionData.direccion,
      referencia: ubicacionData.referencia,
      fechaCreacion: ubicacionData.fechaCreacion || new Date(),
      activo: ubicacionData.activo !== undefined ? ubicacionData.activo : true
    };
    
    setUbicacion(nuevaUbicacion);
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setCategorias(getCategories());
        setEstados(getEstados());
        setUsuarios(getUsers());
        
        // Si es modo editar, cargar datos del reporte
        if (modo === 'editar' && id) {
          const reporteExistente = getReportById(id);
          if (reporteExistente) {
            form.setValue('titulo', reporteExistente.titulo);
            form.setValue('descripcion', reporteExistente.descripcion);
            form.setValue('categoriaId', reporteExistente.categoria.id);
            form.setValue('estadoId', reporteExistente.estado.id);
            form.setValue('activo', reporteExistente.activo !== undefined ? reporteExistente.activo : true);
            if (reporteExistente.prioridad) {
              form.setValue('prioridadId', reporteExistente.prioridad.id);
            }
            if (reporteExistente.asignadoA) {
              form.setValue('asignadoId', reporteExistente.asignadoA.id);
            }
            setUbicacion(reporteExistente.ubicacion);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        toast.error('Error al cargar datos iniciales');
      }
    };

    // Obtener posición del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    }

    loadInitialData();
  }, [form, id, modo]);

  // Manejar envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Verificar que se haya seleccionado una ubicación
    if (!ubicacion) {
      toast.error('Debe seleccionar una ubicación en el mapa');
      return;
    }

    setIsLoading(true);
    try {
      // Encontrar objetos completos por ID
      const categoria = categorias.find(c => c.id === values.categoriaId);
      const estado = estados.find(e => e.id === values.estadoId);
      const prioridad = values.prioridadId ? prioridades.find(p => p.id === values.prioridadId) : undefined;
      const asignado = values.asignadoId ? usuarios.find(u => u.id === values.asignadoId) : undefined;

      if (!categoria || !estado) {
        toast.error('Error al obtener categoría o estado');
        return;
      }

      const reporteData: Omit<Reporte, 'id'> = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        ubicacion: ubicacion,
        categoria: categoria,
        estado: estado,
        prioridad: prioridad,
        asignadoA: asignado,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        fechaInicio: new Date(),
        usuarioCreador: { id: '1', nombre: 'Admin', apellido: 'Sistema', email: 'admin@sistema.com' } as any,
        imagenes: imagenes.map(img => URL.createObjectURL(img)),
        activo: values.activo,
        historialAsignaciones: [],
      };

      if (modo === 'crear') {
        const nuevoReporte = createReport(reporteData);
        toast.success('Reporte creado correctamente');
        navigate(`/admin/reportes/${nuevoReporte.id}`);
      } else if (modo === 'editar' && id) {
        const reporteActual = getReportById(id);
        if (!reporteActual) {
          toast.error('No se encontró el reporte a actualizar');
          return;
        }

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

        const success = await actualizarReporte(reporteActual, reporteData, usuarioSistema);
        if (success) {
          navigate(`/admin/reportes/${id}`);
        }
      }
    } catch (error) {
      console.error('Error al guardar reporte:', error);
      toast.error('Error al guardar reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Si hay cambios en el formulario, mostrar diálogo de confirmación
    if (form.formState.isDirty) {
      setShowCancelDialog(true);
    } else {
      navigate('/admin/reportes');
    }
  };

  const getEstadoColor = (estadoId: string) => {
    const estado = estados.find(e => e.id === estadoId);
    return estado?.color || '#3B82F6';
  };

  return (
    <div>
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
              <span>{modo === 'crear' ? 'Crear' : 'Editar'}</span>
            </div>
          </div>
          <div>
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
              <Edit className="h-4 w-4 mr-2" /> {modo === 'crear' ? 'Crear Reporte' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del reporte */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-muted p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">{form.watch('titulo') || 'Nuevo Reporte'}</h3>
                      <Badge 
                        className="ml-2"
                        variant={form.watch('activo') ? 'default' : 'secondary'}
                      >
                        {form.watch('activo') ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      {form.watch('estadoId') ? estados.find(e => e.id === form.watch('estadoId'))?.nombre : 'Sin estado'}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="general" className="p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                  <TabsTrigger value="asignacion">Asignación</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="titulo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input placeholder="Título del reporte" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="descripcion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descripción detallada del reporte"
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="categoriaId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoría</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categorias.map((categoria) => (
                                    <SelectItem key={categoria.id} value={categoria.id}>
                                      {categoria.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="estadoId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {estados.map((estado) => (
                                    <SelectItem key={estado.id} value={estado.id}>
                                      {estado.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="activo"
                        render={({ field }) => (
                          <FormItem className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <FormLabel className="text-base">Reporte activo</FormLabel>
                                <FormDescription>
                                  Determina si el reporte estará visible en la aplicación
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      <ImageUploader images={imagenes} setImages={setImagenes} maxImages={3} />
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="ubicacion">
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Seleccione la ubicación del reporte en el mapa
                    </div>
                    <MapaSeleccionUbicacion
                      onUbicacionSeleccionada={handleUbicacionSeleccionada}
                      ubicacionInicial={ubicacion}
                      userPosition={userPosition}
                    />
                   
                  </div>
                </TabsContent>

                <TabsContent value="asignacion">
                  <Form {...form}>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="prioridadId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prioridad</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una prioridad" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {prioridades.map((prioridad) => (
                                    <SelectItem key={prioridad.id} value={prioridad.id}>
                                      {prioridad.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="asignadoId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Asignar a</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un responsable" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {usuarios.map((usuario) => (
                                    <SelectItem key={usuario.id} value={usuario.id}>
                                      {usuario.nombre} {usuario.apellido}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="pt-4">
                        <div className="text-sm font-medium mb-2">Fechas importantes:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 p-3 border rounded-md">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Fecha de creación</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date().toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-md">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Creado por</p>
                              <p className="text-sm text-muted-foreground">
                                Admin Sistema
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Columna derecha - Información complementaria */}
          <div className="space-y-6">
            {/* Tarjeta de acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Información de reporte</CardTitle>
                <CardDescription>Detalles sobre este formulario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Estado del reporte</p>
                  <p className="text-sm text-muted-foreground">
                    Indica la situación actual en la que se encuentra el reporte.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Prioridad</p>
                  <p className="text-sm text-muted-foreground">
                    Define la importancia y urgencia para atender este reporte.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Ubicación</p>
                  <p className="text-sm text-muted-foreground">
                    La ubicación exacta donde se reporta el incidente o problema.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Tarjeta de consejos */}
            <Card>
              <CardHeader>
                <CardTitle>Consejos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-800 rounded-md">
                    <Map className="h-5 w-5 text-blue-600" />
                    <p className="text-sm">Recuerde ubicar con precisión el punto en el mapa para facilitar la atención.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded-md">
                    <ClipboardList className="h-5 w-5 text-amber-600" />
                    <p className="text-sm">Una descripción clara y detallada agiliza la resolución del reporte.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          navigate('/admin/reportes');
        }}
        title="¿Cancelar cambios?"
        description="Tienes cambios sin guardar. ¿Estás seguro que deseas salir sin guardar?"
        confirmText="Sí, salir"
        cancelText="No, seguir editando"
      />
    </div>
  );
};

export default FormularioReporteAdmin;
