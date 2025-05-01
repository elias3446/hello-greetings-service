
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, FileText, List, Shield, Activity } from 'lucide-react';

const MenuAdmin = () => {
  const modulos = [
    {
      titulo: 'Gestión de Usuarios',
      descripcion: 'Administración de usuarios del sistema',
      icono: User,
      ruta: '/admin/usuarios',
      color: '#4361ee',
    },
    {
      titulo: 'Gestión de Reportes',
      descripcion: 'Administración de reportes',
      icono: FileText,
      ruta: '/admin/reportes',
      color: '#3a86ff',
    },
    {
      titulo: 'Gestión de Categorías',
      descripcion: 'Administración de categorías de reportes',
      icono: List,
      ruta: '/admin/categorias',
      color: '#4cc9f0',
    },
    {
      titulo: 'Gestión de Roles',
      descripcion: 'Administración de roles de usuario',
      icono: Shield,
      ruta: '/admin/roles',
      color: '#4895ef',
    },
    {
      titulo: 'Gestión de Estados',
      descripcion: 'Administración de estados de reporte',
      icono: Activity,
      ruta: '/admin/estados',
      color: '#560bad',
    },
  ];

  return (
    <Layout titulo="Módulo de Administración">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulos.map((modulo) => (
          <Link to={modulo.ruta} key={modulo.ruta}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{modulo.titulo}</CardTitle>
                  <div 
                    className="p-2 rounded-full" 
                    style={{ backgroundColor: `${modulo.color}20` }}
                  >
                    <modulo.icono size={20} color={modulo.color} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">{modulo.descripcion}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default MenuAdmin;
