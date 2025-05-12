import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { getReportById, createReport, updateReport } from '@/controller/CRUD/reportController';
import { getCategories } from '@/controller/CRUD/categoryController';
import { categorias } from '@/data/categorias';
import { estadosReporte } from '@/data/estadosReporte';
import MapaSeleccionUbicacion from '@/components/reportes/MapaSeleccionUbicacion';
import type { Reporte, Ubicacion, Usuario } from '@/types/tipos';
import ImageUploader from '@/components/ui/ImageUploader';
import { crearReporteCompleto } from '@/controller/controller/reporteCreateController';

interface FormularioReporteProps {
  modo: 'crear' | 'editar';
}

// Esquema para validar el formulario
const formSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  categoriaId: z.string().min(1, 'La categoría es obligatoria'),
});

const FormularioReporte: React.FC<FormularioReporteProps> = ({ modo }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagenes, setImagenes] = useState<File[]>([]);

  // Configurar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      categoriaId: '',
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
    // Si es modo editar, cargar datos del reporte
    const loadReporteData = () => {
      if (modo === 'editar' && id) {
        const reporteExistente = getReportById(id);
        if (reporteExistente) {
          form.setValue('titulo', reporteExistente.titulo);
          form.setValue('descripcion', reporteExistente.descripcion);
          form.setValue('categoriaId', reporteExistente.categoria.id);
          setUbicacion(reporteExistente.ubicacion);
        }
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

    loadReporteData();
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
      // Encontrar la categoría completa por ID
      const categoria = categorias.find(c => c.id === values.categoriaId);

      if (!categoria) {
        toast.error('Error al obtener la categoría');
        return;
      }

      const reporteData: Omit<Reporte, 'id'> = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        ubicacion: ubicacion,
        categoria: categoria,
        estado: estadosReporte[0], // Por defecto estado "Pendiente"
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        fechaInicio: new Date(),
        usuarioCreador: { id: '4', nombre: 'Juan', apellido: 'Pérez', email: 'juan@ejemplo.com' } as any,
        imagenes: imagenes.map(img => URL.createObjectURL(img)),
        activo: true,
        historialAsignaciones: [],
      };

      if (modo === 'crear') {
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

        const resultado = await crearReporteCompleto(reporteData, usuarioSistema, 'Creación de nuevo reporte');
        if (resultado.success && resultado.reporte) {
          toast.success('Reporte creado correctamente');
          navigate(`/reportes/${resultado.reporte.id}`);
        } else {
          toast.error(resultado.message || 'Error al crear el reporte');
        }
      } else if (modo === 'editar' && id) {
        updateReport(id, reporteData);
        toast.success('Reporte actualizado correctamente');
        navigate(`/reportes/${id}`);
      }
    } catch (error) {
      console.error('Error al guardar reporte:', error);
      toast.error('Error al guardar reporte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout >
      <Card>
        <CardHeader>
          <CardTitle>{modo === 'crear' ? 'Crear nuevo reporte' : 'Actualizar información del reporte'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título breve del problema" {...field} />
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
                        placeholder="Describa el problema con la mayor cantidad de detalles posible"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <MapaSeleccionUbicacion
                    onUbicacionSeleccionada={handleUbicacionSeleccionada}
                    ubicacionInicial={ubicacion}
                    userPosition={userPosition}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <ImageUploader images={imagenes} setImages={setImagenes} maxImages={3} />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/reportes')}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? 'Guardando...'
                    : modo === 'crear'
                    ? 'Crear Reporte'
                    : 'Actualizar Reporte'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default FormularioReporte;
