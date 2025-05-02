
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Shield, Edit, X, Mail, User, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { createUser, updateUser, getUserById } from '@/controller/userController';
import { roles } from '@/data/roles';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface FormularioUsuarioProps {
  modo: 'crear' | 'editar';
}

const FormularioUsuario = ({ modo }: FormularioUsuarioProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const usuarioExistente = id ? getUserById(id) : undefined;
  
  const form = useForm({
    defaultValues: {
      nombre: usuarioExistente?.nombre || '',
      apellido: usuarioExistente?.apellido || '',
      email: usuarioExistente?.email || '',
      password: usuarioExistente?.password || '',
      roles: usuarioExistente?.roles?.map(rol => rol.id) || [],
      estado: usuarioExistente?.estado || 'activo',
      tipo: usuarioExistente?.tipo || 'usuario'
    },
  });

  // Load existing user data when in edit mode
  useEffect(() => {
    if (modo === 'editar' && id) {
      const usuarioExistente = getUserById(id);
      if (usuarioExistente) {
        // Map roles to their IDs for the form
        const rolesIds = usuarioExistente.roles?.map(r => r.id) || [];
        
        form.reset({
          nombre: usuarioExistente.nombre,
          apellido: usuarioExistente.apellido,
          email: usuarioExistente.email,
          password: usuarioExistente.password,
          roles: rolesIds,
          estado: usuarioExistente.estado,
          tipo: usuarioExistente.tipo
        });
      }
    }
  }, [modo, id, form]);

  const onSubmit = (data: any) => {
    try {
      const rolesSeleccionados = roles.filter(rol => 
        data.roles.includes(rol.id)
      );
      
      const userData = {
        ...data,
        roles: rolesSeleccionados,
        permisos: rolesSeleccionados.flatMap(rol => rol.permisos || []),
        intentosFallidos: 0
      };

      if (modo === 'editar' && id) {
        const usuarioActualizado = updateUser(id, userData);

        if (usuarioActualizado) {
          toast.success("Usuario actualizado exitosamente");
        } else {
          throw new Error("No se pudo actualizar el usuario");
        }
      } else {
        createUser({
          ...userData,
          fechaCreacion: new Date()
        });

        toast.success("Usuario creado exitosamente");
      }

      navigate('/admin/usuarios');
    } catch (error) {
      toast.error("Error al procesar el usuario");
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    // Si hay cambios en el formulario, mostrar diálogo de confirmación
    if (form.formState.isDirty) {
      setShowCancelDialog(true);
    } else {
      navigate('/admin/usuarios');
    }
  };

  // Obtener las iniciales del usuario para el avatar
  const getInitials = () => {
    const nombre = form.watch('nombre');
    const apellido = form.watch('apellido');
    
    if (nombre && apellido) {
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    } else if (nombre) {
      return nombre.substring(0, 2).toUpperCase();
    } else {
      return 'US';
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Encabezado con breadcrumbs y botón de regreso */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center">
              <Link to="/admin/usuarios" className="hover:underline flex items-center">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Usuarios
              </Link>
              <span className="mx-2">/</span>
              <span>{modo === 'crear' ? 'Crear' : 'Editar'}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              {modo === 'crear' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
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
              <Edit className="h-4 w-4 mr-2" /> {modo === 'crear' ? 'Crear Usuario' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del usuario */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-muted p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold">
                        {(form.watch('nombre') || form.watch('apellido')) 
                          ? `${form.watch('nombre')} ${form.watch('apellido')}` 
                          : 'Nuevo Usuario'}
                      </h3>
                      <Badge 
                        className="ml-2"
                        variant={form.watch('estado') === 'activo' ? 'default' : 'secondary'}
                      >
                        {form.watch('estado') === 'activo' ? 'Activo' : 
                         form.watch('estado') === 'inactivo' ? 'Inactivo' : 'Bloqueado'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {form.watch('email') || 'correo@ejemplo.com'}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="general" className="p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="cuenta">Datos de Cuenta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <Form {...form}>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nombre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre del usuario" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="apellido"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Apellido</FormLabel>
                              <FormControl>
                                <Input placeholder="Apellido del usuario" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Separator className="my-4" />
                      
                      <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Usuario</FormLabel>
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
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="cuenta">
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder={modo === 'editar' ? '••••••••' : 'Contraseña'}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              {modo === 'editar' ? 'Deje en blanco para mantener la contraseña actual' : 
                                'Mínimo 8 caracteres con letras y números'}
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rol</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={(value) => field.onChange([value])}
                                defaultValue={field.value?.[0]}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rol" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {roles.map((rol) => (
                                    <SelectItem key={rol.id} value={rol.id}>
                                      {rol.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estado"
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
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                                <SelectItem value="bloqueado">Bloqueado</SelectItem>
                              </SelectContent>
                            </Select>
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
            {/* Tarjeta de información */}
            <Card>
              <CardHeader>
                <CardTitle>Información de usuario</CardTitle>
                <CardDescription>Detalles sobre este formulario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tipo de usuario</p>
                  <p className="text-sm text-muted-foreground">
                    Los usuarios de tipo administrativo tienen acceso a más funciones del sistema.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Roles</p>
                  <p className="text-sm text-muted-foreground">
                    El rol determina qué permisos tendrá el usuario en el sistema.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Estado</p>
                  <p className="text-sm text-muted-foreground">
                    Activo: Usuario con acceso al sistema<br/>
                    Inactivo: Usuario sin acceso al sistema<br/>
                    Bloqueado: Usuario bloqueado por intentos fallidos
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
                    <User className="h-5 w-5 text-blue-600" />
                    <p className="text-sm">Complete todos los campos obligatorios marcados con un asterisco.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded-md">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <p className="text-sm">Los usuarios administrativos deben asignarse con precaución.</p>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 text-green-800 rounded-md">
                    <Users className="h-5 w-5 text-green-600" />
                    <p className="text-sm">Asigne roles apropiados según las funciones del usuario.</p>
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
          navigate('/admin/usuarios');
        }}
        title="¿Cancelar cambios?"
        description="Tienes cambios sin guardar. ¿Estás seguro que deseas salir sin guardar?"
        confirmText="Sí, salir"
        cancelText="No, seguir editando"
      />
    </div>
  );
};

export default FormularioUsuario;
