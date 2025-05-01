
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rol } from '@/types/tipos';

interface RolesDetailListProps {
  roles: Rol[];
}

const RolesDetailList = ({ roles }: RolesDetailListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle de Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roles.map((rol) => (
            <div 
              key={rol.id} 
              className="p-4 border rounded-lg"
              style={{ borderColor: rol.color }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: rol.color }}>{rol.nombre}</h3>
                  <p className="text-muted-foreground text-sm">{rol.descripcion}</p>
                </div>
                <Badge style={{ backgroundColor: rol.color }}>
                  {rol.tipo === 'admin' ? 'Administrador' : 'Usuario'}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Permisos ({rol.permisos?.length || 0})</h4>
                <div className="flex flex-wrap gap-2">
                  {rol.permisos && rol.permisos.slice(0, 5).map((permiso, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-muted text-xs rounded-full"
                    >
                      {permiso.nombre}
                    </span>
                  ))}
                  {rol.permisos && rol.permisos.length > 5 && (
                    <span className="px-2 py-1 bg-muted text-xs rounded-full">
                      +{rol.permisos.length - 5} más
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesDetailList;
