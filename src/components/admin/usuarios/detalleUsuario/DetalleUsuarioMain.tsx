import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserInfo } from '@/components/admin/usuarios/UserInfo';
import { UserReports } from '@/components/admin/usuarios/UserReports';
import ActividadItem from '@/components/layout/ActividadItem';
import { DetalleUsuarioMainProps } from '@/props/admin/usuarios/PropDetalleusuario';

export const DetalleUsuarioMain: React.FC<DetalleUsuarioMainProps> = ({
  usuario,
  reportesAsignados,
  actividadesDelUsuario,
  onEditarUsuario,
}) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <UserInfo usuario={usuario} />

      <Tabs defaultValue="info" className="p-6">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Reportes asignados</h4>
            <UserReports 
              reportes={reportesAsignados}
              onAsignarReporte={onEditarUsuario}
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
  );
}; 