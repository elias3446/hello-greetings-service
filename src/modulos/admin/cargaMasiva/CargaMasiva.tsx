import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ImportForm from './ImportForm';
import { TipoEntidad } from '@/types/tipos';

const CargaMasiva = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TipoEntidad>('usuarios');

  return (
    
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Importar datos</CardTitle>
            <CardDescription>
              Carga masiva de datos mediante archivos CSV, Excel o JSON.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as TipoEntidad)}>
              <TabsList className="grid grid-cols-5 w-full mb-4">
                <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                <TabsTrigger value="reportes">Reportes</TabsTrigger>
                <TabsTrigger value="categorias">Categorías</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="estados">Estados</TabsTrigger>
              </TabsList>
              <TabsContent value="usuarios">
                <ImportForm tipoEntidad="usuarios" />
              </TabsContent>
              <TabsContent value="reportes">
                <ImportForm tipoEntidad="reportes" />
              </TabsContent>
              <TabsContent value="categorias">
                <ImportForm tipoEntidad="categorias" />
              </TabsContent>
              <TabsContent value="roles">
                <ImportForm tipoEntidad="roles" />
              </TabsContent>
              <TabsContent value="estados">
                <ImportForm tipoEntidad="estados" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
  );
};

export default CargaMasiva;
