import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Edit, X, Shield, FileText, icons } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createCategory, updateCategory, getCategoryById } from '@/controller/CRUD/categoryController';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import ColorPicker from '@/components/admin/estados/ColorPicker';
import { IconPicker } from "@/components/IconPicker";
import { LucideIcon } from "lucide-react";
interface FormularioCategoriaProps {
  modo: 'crear' | 'editar';
}

const FormularioCategoria = ({ modo }: FormularioCategoriaProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const categoriaExistente = id ? getCategoryById(id) : undefined;
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(categoriaExistente?.icono || 'category');

  const SelectedIcon = selectedIcon ? icons[selectedIcon] : null;
  
  const form = useForm({
    defaultValues: {
      nombre: categoriaExistente?.nombre || '',
      descripcion: categoriaExistente?.descripcion || '',
      color: categoriaExistente?.color || '#4361ee',
      icono: categoriaExistente?.icono || 'category',
      activo: categoriaExistente?.activo !== undefined ? categoriaExistente.activo : true
    },
  });

  const onSubmit = (data: any) => {
    try {
      if (modo === 'editar' && id) {
        const categoriaActualizada = updateCategory(id, {
          ...data,
          fechaActualizacion: new Date(),
        });

        if (categoriaActualizada) {
          toast.success("Categoría actualizada exitosamente");
        } else {
          throw new Error("No se pudo actualizar la categoría");
        }
      } else {
        const nuevaCategoria = createCategory({
          ...data,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
          fechaEliminacion: new Date(),
        });

        toast.success("Categoría creada exitosamente");
      }

      navigate('/admin/categorias');
    } catch (error) {
      toast.error("Error al procesar la categoría");
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    // Si hay cambios en el formulario, mostrar diálogo de confirmación
    if (form.formState.isDirty) {
      setShowCancelDialog(true);
    } else {
      navigate('/admin/categorias');
    }
  };

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
            <Button onClick={form.handleSubmit(onSubmit)}>
              <Edit className="h-4 w-4 mr-2" /> {modo === 'crear' ? 'Crear Categoría' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información de la categoría */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-muted p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarFallback style={{ backgroundColor: form.watch('color') }}>
                      {form.watch('nombre').substring(0, 2).toUpperCase() || 'CT'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">{form.watch('nombre') || 'Nueva Categoría'}</h3>
                      <Badge 
                        className="ml-2"
                        variant={form.watch('activo') ? 'default' : 'secondary'}
                      >
                        {form.watch('activo') ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <FileText className="h-4 w-4 mr-2" />
                      {form.watch('descripcion') ? 
                        (form.watch('descripcion').length > 50 ? 
                          form.watch('descripcion').substring(0, 50) + '...' : 
                          form.watch('descripcion')) : 
                        'Sin descripción'}
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
                              <Input placeholder="Nombre de la categoría" {...field} />
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
                                placeholder="Descripción de la categoría"
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
                                <FormLabel className="text-base">Categoría activa</FormLabel>
                                <FormDescription>
                                  Determina si la categoría estará disponible en la aplicación
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
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="icono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icono</FormLabel>
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
                            <FormMessage />
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
                <CardTitle>Información de categoría</CardTitle>
                <CardDescription>Detalles sobre este formulario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Nombre y descripción</p>
                  <p className="text-sm text-muted-foreground">
                    Define un nombre claro y una descripción que explique para qué se utilizará esta categoría.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Color e icono</p>
                  <p className="text-sm text-muted-foreground">
                    El color e icono ayudan a identificar visualmente esta categoría en la interfaz.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Estado</p>
                  <p className="text-sm text-muted-foreground">
                    Desactiva la categoría si deseas ocultarla temporalmente sin eliminarla.
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
                    <FileText className="h-5 w-5 text-blue-600" />
                    <p className="text-sm">Las categorías ayudan a organizar y filtrar los reportes en la aplicación.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded-md">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <p className="text-sm">Utiliza colores distintivos para facilitar la identificación visual.</p>
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
          navigate('/admin/categorias');
        }}
        title="¿Cancelar cambios?"
        description="Tienes cambios sin guardar. ¿Estás seguro que deseas salir sin guardar?"
        confirmText="Sí, salir"
        cancelText="No, seguir editando"
      />
    </div>
  );
};

export default FormularioCategoria;
