
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getReportById } from '@/controller/reportController';
import { Reporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft } from 'lucide-react';
import DetalleReporte from '@/modulos/reportes/DetalleReporte';

const DetalleReporteAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      try {
        const reporteData = getReportById(id);
        if (reporteData) {
          setReporte(reporteData);
        } else {
          toast.error('Reporte no encontrado');
          navigate('/admin/reportes');
        }
      } catch (error) {
        toast.error('Error al cargar el reporte');
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, navigate]);

  const handleVolver = () => {
    navigate('/admin/reportes');
  };

  if (isLoading) {
    return (
      <Layout titulo="Cargando reporte...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (!reporte) {
    return (
      <Layout titulo="Reporte no encontrado">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              El reporte solicitado no existe o ha sido eliminado.
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={handleVolver}>Volver a la lista</Button>
            </div>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <div>
      <DetalleReporte />
    </div>
  );
};

export default DetalleReporteAdmin;
