import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Shield, Users } from 'lucide-react';

export const InfoCard = () => (
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
);

export const TipsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Consejos</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-800 rounded-md dark:bg-gray-800 dark:text-blue-400">
          <User className="h-5 w-5 text-blue-600" />
          <p className="text-sm">Complete todos los campos obligatorios marcados con un asterisco.</p>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded-md dark:bg-gray-800 dark:text-amber-400">
          <Shield className="h-5 w-5 text-amber-600" />
          <p className="text-sm">Los usuarios administrativos deben asignarse con precaución.</p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-green-50 text-green-800 rounded-md dark:bg-gray-800 dark:text-green-400">
          <Users className="h-5 w-5 text-green-600" />
          <p className="text-sm">Asigne roles apropiados según las funciones del usuario.</p>
        </div>
      </div>
    </CardContent>
  </Card>
); 