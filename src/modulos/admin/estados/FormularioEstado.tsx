import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, X, Shield, Check, AlertTriangle, Clock, CheckCircle, XCircle, AlertCircle, icons } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { createEstado, getEstadoById, updateEstado } from '@/controller/CRUD/estadoController';
import ColorPicker from '@/components/admin/estados/ColorPicker';
import { IconPicker } from "@/components/IconPicker";
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface FormularioEstadoProps {
  modo: 'crear' | 'editar';
}

// Helper function to map icon names to valid tipos
const mapIconToTipo = (iconName: string): "pendiente" | "en_progreso" | "completado" | "cancelado" => {
  switch (iconName) {
    case 'alert-triangle':
      return "pendiente";
    case 'clock':
      return "en_progreso";
    case 'check-circle':
      return "completado";
    case 'x-circle':
      return "cancelado";
    default:
      return "pendiente"; // Default to pendiente for safety
  }
};

const FormularioEstado: React.FC<FormularioEstadoProps> = ({ modo }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const estadoExistente = id ? getEstadoById(id) : undefined;
  const [selectedIcon, setSelectedIcon] = useState<string | null>(estadoExistente?.icono || 'alert-triangle');

  const SelectedIcon = selectedIcon ? icons[selectedIcon] : null;

  const form = useForm({
    defaultValues: {
      nombre: estadoExistente?.nombre || '',
      descripcion: estadoExistente?.descripcion || '',
      color: estadoExistente?.color || '#FFD166',
      icono: estadoExistente?.icono || 'alert-triangle',
      activo: estadoExistente?.activo !== undefined ? estadoExistente.activo : true,
    },
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'alert-triangle':
        return <AlertTriangle />;
      case 'clock':
        return <Clock />;
      case 'check-circle':
        return <CheckCircle />;
      case 'x-circle':
        return <XCircle />;
      case 'alert-circle':
        return <AlertCircle />;
      default:
        return <Check />;
    }
  };

  const onSubmit = (data: any) => {
    try {
      // Validaciones básicas
      if (!data.nombre) {
        throw new Error('El nombre del estado es obligatorio');
      }

      // Mapping icon to a valid tipo
      const tipoMapped = mapIconToTipo(data.icono);
      
      // Creando el objeto de datos
      const estadoData = {
        ...data,
        tipo: tipoMapped, // Use the mapped tipo that matches the required enum values
        fechaCreacion: new Date(),
      };

      if (modo === 'crear') {
        createEstado(estadoData);
        toast.success('Estado creado exitosamente');
      } else if (id) {
        updateEstado(id, estadoData);
        toast.success('Estado actualizado exitosamente');
      }

      navigate('/admin/estados');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    // Si hay cambios en el formulario, mostrar diálogo de confirmación
    if (form.formState.isDirty) {
      setShowCancelDialog(true);
    } else {
      navigate('/admin/estados');
    }
  };

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
              <span>{modo === 'crear' ? 'Crear' : 'Editar'}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              {modo === 'crear' ? 'Crear Nuevo Estado' : 'Editar Estado'}
            </h2>
          </div>
          <div>
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              <Edit className="h-4 w-4 mr-2" /> {modo === 'crear' ? 'Crear Estado' : 'Guardar Cambios'}
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
                    <AvatarFallback style={{ backgroundColor: form.watch('color') }}>
                      {form.watch('nombre').substring(0, 2).toUpperCase() || 'ES'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">{form.watch('nombre') || 'Nuevo Estado'}</h3>
                      <Badge 
                        className="ml-2"
                        variant={form.watch('activo') ? 'default' : 'secondary'}
                      >
                        {form.watch('activo') ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      {getIconComponent(form.watch('icono'))}
                      <span className="ml-2">
                        {mapIconToTipo(form.watch('icono')).replace('_', ' ').charAt(0).toUpperCase() + 
                        mapIconToTipo(form.watch('icono')).replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="general" className="p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="visual">Aspecto Visual</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del estado" {...field} />
                            </FormControl>
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
                                placeholder="Descripción del estado"
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="activo"
                        render={({ field }) => (
                          <FormItem className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <FormLabel className="text-base">Estado Activo</FormLabel>
                                <FormDescription>
                                  Los estados inactivos no aparecerán en las listas de selección
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
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="visual">
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <ColorPicker 
                                color={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormDescription>
                              Este color se utilizará para identificar visualmente el estado en la interfaz
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="icono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icono</FormLabel>
                            <FormDescription className="mb-2">
                              Selecciona un icono para representar este estado. El icono seleccionado también definirá el tipo del estado.
                            </FormDescription>
                            <FormControl>
                              <div className="flex flex-col items-center space-y-4">
                                {selectedIcon && SelectedIcon ? (
                                  <div className="p-4 rounded-lg bg-gray-50 border flex flex-col items-center">
                                    <SelectedIcon size={48} className="text-blue-500" />
                                    <span className="mt-2 text-sm font-medium">{selectedIcon}</span>
                                  </div>
                                ) : (
                                  <div className="p-4 rounded-lg bg-gray-50 border flex items-center justify-center w-24 h-24 text-gray-300">
                                    Sin selección
                                  </div>
                                )}
                                
                                <Button 
                                  type="button"
                                  variant="outline" 
                                  onClick={() => setIsOpen(true)}
                                  className="w-full"
                                >
                                  {selectedIcon ? "Cambiar icono" : "Seleccionar icono"}
                                </Button>
                                
                                <IconPicker
                                  open={isOpen}
                                  onOpenChange={setIsOpen}
                                  onSelect={(iconName) => {
                                    setSelectedIcon(iconName);
                                    field.onChange(iconName);
                                    setIsOpen(false);
                                  }}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
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
                <CardTitle>Información de estado</CardTitle>
                <CardDescription>Detalles sobre este formulario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tipos de estado</p>
                  <p className="text-sm text-muted-foreground">
                    El icono seleccionado define el tipo de estado (pendiente, en progreso, completado o cancelado).
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Color e icono</p>
                  <p className="text-sm text-muted-foreground">
                    El color e icono ayudan a identificar visualmente este estado en la interfaz.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Estado activo</p>
                  <p className="text-sm text-muted-foreground">
                    Desactiva el estado si deseas ocultarlo temporalmente sin eliminarlo.
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
                    <Shield className="h-5 w-5 text-blue-600" />
                    <p className="text-sm">Usa colores distintivos para cada tipo de estado para mejorar la experiencia visual.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded-md">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <p className="text-sm">Los estados son fundamentales para el seguimiento del ciclo de vida de los reportes.</p>
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
          navigate('/admin/estados');
        }}
        title="¿Cancelar cambios?"
        description="Tienes cambios sin guardar. ¿Estás seguro que deseas salir sin guardar?"
        confirmText="Sí, salir"
        cancelText="No, seguir editando"
      />
    </div>
  );
};

export default FormularioEstado;
