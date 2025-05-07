import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, Users, Tag, Shield, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ImportForm from './ImportForm';
import { TipoEntidad } from '@/types/tipos';

const CargaMasiva = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TipoEntidad>('usuarios');

  const handleTabChange = (tab: TipoEntidad) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        <div className="py-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Importar datos</CardTitle>
              <CardDescription>
                Carga masiva de datos mediante archivos CSV.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col space-y-4">
                <div className="hidden sm:flex sm:space-x-4">
                  <button
                    onClick={() => handleTabChange('usuarios')}
                    className={`nav-link ${activeTab === 'usuarios' ? 'text-primary' : ''}`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Usuarios
                  </button>
                  <button
                    onClick={() => handleTabChange('reportes')}
                    className={`nav-link ${activeTab === 'reportes' ? 'text-primary' : ''}`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Reportes
                  </button>
                  <button
                    onClick={() => handleTabChange('categorias')}
                    className={`nav-link ${activeTab === 'categorias' ? 'text-primary' : ''}`}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Categorías
                  </button>
                  <button
                    onClick={() => handleTabChange('roles')}
                    className={`nav-link ${activeTab === 'roles' ? 'text-primary' : ''}`}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Roles
                  </button>
                  <button
                    onClick={() => handleTabChange('estados')}
                    className={`nav-link ${activeTab === 'estados' ? 'text-primary' : ''}`}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Estados
                  </button>
                </div>

                <div className="sm:hidden">
                  <div className="space-y-1">
                    <button
                      onClick={() => handleTabChange('usuarios')}
                      className={`nav-link w-full py-3 ${activeTab === 'usuarios' ? 'text-primary' : ''}`}
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Usuarios
                    </button>
                    <button
                      onClick={() => handleTabChange('reportes')}
                      className={`nav-link w-full py-3 ${activeTab === 'reportes' ? 'text-primary' : ''}`}
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Reportes
                    </button>
                    <button
                      onClick={() => handleTabChange('categorias')}
                      className={`nav-link w-full py-3 ${activeTab === 'categorias' ? 'text-primary' : ''}`}
                    >
                      <Tag className="h-5 w-5 mr-2" />
                      Categorías
                    </button>
                    <button
                      onClick={() => handleTabChange('roles')}
                      className={`nav-link w-full py-3 ${activeTab === 'roles' ? 'text-primary' : ''}`}
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Roles
                    </button>
                    <button
                      onClick={() => handleTabChange('estados')}
                      className={`nav-link w-full py-3 ${activeTab === 'estados' ? 'text-primary' : ''}`}
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Estados
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  {activeTab === 'usuarios' && <ImportForm tipoEntidad="usuarios" />}
                  {activeTab === 'reportes' && <ImportForm tipoEntidad="reportes" />}
                  {activeTab === 'categorias' && <ImportForm tipoEntidad="categorias" />}
                  {activeTab === 'roles' && <ImportForm tipoEntidad="roles" />}
                  {activeTab === 'estados' && <ImportForm tipoEntidad="estados" />}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CargaMasiva;
