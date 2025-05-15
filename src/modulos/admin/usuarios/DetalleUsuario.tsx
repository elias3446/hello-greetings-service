import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { useUsuario } from '@/hooks/useUsuario';
import { UserInfo } from '@/components/admin/usuarios/UserInfo';
import { UserActions } from '@/components/admin/usuarios/UserActions';
import { UserHistory } from '@/components/admin/usuarios/UserHistory';
import { UserReports } from '@/components/admin/usuarios/UserReports';
import ActividadItem from '@/components/layout/ActividadItem';
import { obtenerHistorialUsuario } from '@/controller/CRUD/user/historialUsuario';
import { actualizarEstadoUsuario } from '@/controller/controller/user/userStateController';
import { toast } from '@/components/ui/sonner';
import { updateUser } from '@/controller/CRUD/user/userController';
import { filtrarReportes } from '@/controller/CRUD/report/reportController';

const DetalleUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    usuario,
    loading,
    reportesAsignados,
    historialEstados,
    handleRoleChange,
    handleEliminarUsuario,
    handleEditarUsuario,
    setUsuario,
    setReportesAsignados
  } = useUsuario();

  const handleCambiarEstado = async () => {
    if (!usuario) return false;

    if (usuario.estado === 'bloqueado') {
      toast.error('No se puede cambiar el estado de un usuario bloqueado');
      return false;
    }

    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    
    const resultado = await actualizarEstadoUsuario(
      usuario,
      nuevoEstado,
      {
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
      }
    );

    if (resultado) {
      // Actualizar el estado local del usuario
      const usuarioActualizado = updateUser(usuario.id, { estado: nuevoEstado });
      if (usuarioActualizado) {
        setUsuario(usuarioActualizado);
        // Actualizar los reportes asignados
        const nuevosReportes = filtrarReportes({ userId: usuario.id });
        setReportesAsignados(nuevosReportes);
      }
    }

    return resultado;
  };

  if (loading) {
    return (
      <Layout titulo="Cargando usuario...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return (
      <Layout titulo="Usuario no encontrado">
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Usuario no encontrado</h2>
          <p className="text-muted-foreground mb-6">No se pudo encontrar el usuario solicitado</p>
          <Button asChild>
            <Link to="/admin/usuarios">Volver a la lista</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const actividadesDelUsuario = obtenerHistorialUsuario(usuario.id);

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
              <span>Detalle</span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del usuario */}
          <div className="md:col-span-2 space-y-6">
            <UserInfo usuario={usuario} />

            <Tabs defaultValue="info" className="p-6">
              <TabsList className="mb-4">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="activity">Actividad</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-6">
                {/* Información de reportes asignados */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Reportes asignados</h4>
                  <UserReports 
                    reportes={reportesAsignados}
                    onAsignarReporte={handleEditarUsuario}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="activity">
                <div className="space-y-4">
                  {actividadesDelUsuario.length > 0 ? (
                    actividadesDelUsuario.map((actividad) => (
                      <ActividadItem key={actividad.id} actividad={actividad} />
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">No hay actividad registrada para este usuario.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Columna derecha - Información complementaria */}
          <div className="space-y-6">
            {/* Tarjeta de acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones rápidas</CardTitle>
                <CardDescription>Opciones para gestionar este usuario</CardDescription>
              </CardHeader>
              <CardContent>
                <UserActions
                  usuario={usuario}
                  onRoleChange={handleRoleChange}
                  onEstadoChange={handleCambiarEstado}
                  onDelete={handleEliminarUsuario}
                />
              </CardContent>
            </Card>
            
            {/* Tarjeta de historial */}
            <UserHistory historial={historialEstados} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleUsuario;
