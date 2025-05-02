
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import MapaBase from '@/components/layout/MapaBase';
import { reportes } from '@/data/reportes';
import type { Reporte } from '@/types/tipos';
import ReporteInfo from '@/components/reportes/ReporteInfo';

const Mapa = () => {
  const [reporteSeleccionado, setReporteSeleccionado] = useState<Reporte | null>(null);

  const handleReporteSelect = (reporte: Reporte) => {
    setReporteSeleccionado(reporte);
  };

  const handleClosePopup = () => {
    setReporteSeleccionado(null);
  };

  return (
    <Layout>
      <div className="grid md:grid-cols-3 gap-4 relative">
        <div className="md:col-span-2">
          <MapaBase 
            reportes={reportes} 
            onReporteSelect={handleReporteSelect}
            altura="70vh"
            initialPosition={reporteSeleccionado ? [
              reporteSeleccionado.ubicacion.latitud, 
              reporteSeleccionado.ubicacion.longitud
            ] : undefined}
            forceInitialPosition={!!reporteSeleccionado}
          />
        </div>

        <div className="md:col-span-1">
          {reporteSeleccionado ? (
            <ReporteInfo reporte={reporteSeleccionado} />
          ) : (
            <div className="border rounded-lg p-6 h-full flex items-center justify-center text-center">
              <div>
                <h3 className="text-xl font-medium mb-2">Selecciona un reporte</h3>
                <p className="text-muted-foreground">
                  Haz clic en un marcador del mapa para ver los detalles del reporte
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Mapa;
