import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/components/forms/UserFormHeader';
import { GeneralInfoTab, AccountInfoTab } from '@/components/forms/UserFormTabs';
import { FormularioUsuarioContentProps } from '@/props/admin/usuarios/PropFormularioUsuario';

const FormularioUsuarioContent: React.FC<FormularioUsuarioContentProps> = ({
  form,
  modo
}) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <Card className="overflow-hidden">
        <UserProfile form={form} />

        <Tabs defaultValue="general" className="p-6">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="cuenta">Datos de Cuenta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralInfoTab form={form} />
          </TabsContent>
          
          <TabsContent value="cuenta">
            <AccountInfoTab form={form} modo={modo} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default FormularioUsuarioContent; 