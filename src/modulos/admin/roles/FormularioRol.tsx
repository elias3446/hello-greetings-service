
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Shield, Edit, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { createRole, updateRole, getRoleById } from '@/controller/roleController';
import { permisosDisponibles } from '@/data/permisos';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import ColorPicker from '@/components/admin/estados/ColorPicker';

interface FormularioRolProps {
  modo: 'crear' | 'editar';
}

const FormularioRol = ({ modo }: FormularioRolProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  
  // Define the form with default values
  const form = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      color: '#3B82F6',
      tipo: 'usuario',
      permisos: [] as string[],
      activo: true
    },
  });

  // Load existing role data when in edit mode
  useEffect(() => {
    if (modo === 'editar' && id) {
      const rolExistente = getRoleById(id);
      if (rolExistente) {
        // Map permissions to their IDs for the form
        const permisosIds = rolExistente.permisos?.map(p => p.id) || [];
        
        form.reset({
          nombre: rolExistente.nombre,
          descripcion: rolExistente.descripcion,
          color: rolExistente.color,
          tipo: rolExistente.tipo,
          permisos: permisosIds,
          activo: rolExistente.activo !== undefined ? rolExistente.activo : true
        });
      }
    }
  }, [modo, id, form]);

  const onSubmit = (data: any) => {
    try {
      // Map permission IDs to permission objects
      const permisosSeleccionados = data.permisos.map((permisoId: string) => 
        permisosDisponibles.find(p => p.id === permisoId)
      ).filter(Boolean);
      
      if (modo === 'editar' && id) {
        const rolActualizado = updateRole(id, {
          nombre: data.nombre,
          descripcion: data.descripcion,
          color: data.color,
          tipo: data.tipo,
          permisos: permisosSeleccionados,
          activo: data.activo
        });

        toast.success("Rol actualizado exitosamente");
      } else {
        const nuevoRol = createRole({
          nombre: data.nombre,
          descripcion: data.descripcion,
          color: data.color,
          tipo: data.tipo,
          permisos: permisosSeleccionados,
          activo: data.activo,
          fechaCreacion: new Date()
        });

        toast.success("Rol creado exitosamente");
      }

      navigate('/admin/roles');
    } catch (error) {
      toast.error("Error al procesar el rol");
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    // Si hay cambios en el formulario, mostrar diálogo de confirmación
    if (form.formState.isDirty) {
      setShowCancelDialog(true);
    } else {
      navigate('/admin/roles');
    }
  };

  return (
    <div>
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
              <span>{modo === 'crear' ? 'Crear' : 'Editar'}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              {modo === 'crear' ? 'Crear Nuevo Rol' : 'Editar Rol'}
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
              <Edit className="h-4 w-4 mr-2" /> {modo === 'crear' ? 'Crear Rol' : 'Guardar Cambios'}
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
                    <AvatarFallback style={{ backgroundColor: form.watch('color') }}>
                      {form.watch('nombre').substring(0, 2).toUpperCase() || 'RL'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">{form.watch('nombre') || 'Nuevo Rol'}</h3>
                      <Badge 
                        className="ml-2"
                        variant={form.watch('activo') ? 'default' : 'secondary'}
                      >
                        {form.watch('activo') ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Shield className="h-4 w-4 mr-2" />
                      {form.watch('tipo') === 'admin' ? 'Administrativo' : 'Usuario'}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="general" className="p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="permisos">Permisos</TabsTrigger>
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
                              <Input placeholder="Nombre del rol" {...field} />
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
                                placeholder="Descripción del rol"
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          name="tipo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <FormControl>
                                <div className="flex gap-4">
                                  <div className="flex items-center space-x-2">
                                    <input 
                                      type="radio" 
                                      id="usuario" 
                                      value="usuario"
                                      checked={field.value === "usuario"}
                                      onChange={() => field.onChange("usuario")}
                                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="usuario" className="text-sm text-gray-700">Usuario</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input 
                                      type="radio" 
                                      id="admin" 
                                      value="admin"
                                      checked={field.value === "admin"}
                                      onChange={() => field.onChange("admin")}
                                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="admin" className="text-sm text-gray-700">Administrativo</label>
                                  </div>
                                </div>
                              </FormControl>
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
                                <FormLabel className="text-base">Rol activo</FormLabel>
                                <FormDescription>
                                  Determina si el rol estará disponible en la aplicación
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
                
                <TabsContent value="permisos">
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="permisos"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Permisos asignados</FormLabel>
                            <div className="mt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {permisosDisponibles.map((permiso) => (
                                  <FormField
                                    key={permiso.id}
                                    control={form.control}
                                    name="permisos"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={permiso.id}
                                          className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/20"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(permiso.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, permiso.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== permiso.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="font-medium">
                                              {permiso.nombre}
                                            </FormLabel>
                                            <FormDescription className="text-xs">
                                              {permiso.descripcion}
                                            </FormDescription>
                                          </div>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
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
                <CardTitle>Información de rol</CardTitle>
                <CardDescription>Detalles sobre este formulario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tipo de rol</p>
                  <p className="text-sm text-muted-foreground">
                    Los roles de tipo administrativo tienen acceso a más funciones del sistema.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Permisos</p>
                  <p className="text-sm text-muted-foreground">
                    Seleccione los permisos que tendrán los usuarios con este rol.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Color</p>
                  <p className="text-sm text-muted-foreground">
                    El color ayuda a identificar visualmente este rol en la interfaz.
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
                    <p className="text-sm">Asigne solo los permisos necesarios siguiendo el principio de mínimo privilegio.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded-md">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <p className="text-sm">Los roles administrativos deben asignarse con precaución.</p>
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
          navigate('/admin/roles');
        }}
        title="¿Cancelar cambios?"
        description="Tienes cambios sin guardar. ¿Estás seguro que deseas salir sin guardar?"
        confirmText="Sí, salir"
        cancelText="No, seguir editando"
      />
    </div>
  );
};

export default FormularioRol;
