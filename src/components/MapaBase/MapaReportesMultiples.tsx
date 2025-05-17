import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import type { MarkerProps } from 'react-leaflet';
import { MapaBase, reportIcon, RecenterAutomatically } from './MapaBase';
import { Reporte } from '@/types/tipos';

interface MapaReportesMultiplesProps {
  reportes: Reporte[];
  className?: string;
  height?: string;
  onReporteClick?: (reporte: Reporte) => void;
}

const MapaReportesMultiples: React.FC<MapaReportesMultiplesProps> = ({
  reportes,
  className,
  height,
  onReporteClick
}) => {
  const [userPosition, setUserPosition] = useState<[number, number]>([0, 0]);
  const [selectedReportePosition, setSelectedReportePosition] = useState<[number, number] | null>(null);

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  const handleMarkerClick = (reporte: Reporte) => {
    const position: [number, number] = [reporte.ubicacion.latitud, reporte.ubicacion.longitud];
    setSelectedReportePosition(position);
    if (onReporteClick) {
      onReporteClick(reporte);
    }
  };

  return (
    <MapaBase 
      className={className} 
      height={height} 
      initialCenter={userPosition[0] !== 0 ? userPosition : undefined}
    >
      {/* Center on user position initially */}
      {userPosition[0] !== 0 && !selectedReportePosition && 
        <RecenterAutomatically position={userPosition} maxZoom={18} />
      }
      
      {/* Center on selected report when clicked */}
      {selectedReportePosition && 
        <RecenterAutomatically position={selectedReportePosition} maxZoom={18} />
      }
      
      {reportes.map((reporte) => {
        const position: [number, number] = [reporte.ubicacion.latitud, reporte.ubicacion.longitud];
        return (
          <Marker 
            key={reporte.id} 
            {...({ 
              position,
              icon: reportIcon,
              eventHandlers: {
                click: () => handleMarkerClick(reporte),
              }
            } as MarkerProps)}
          >
            <Popup>
              <div>
                <h3 className="font-medium text-lg">{reporte.titulo}</h3>
                {reporte.descripcion && <p className="text-sm mt-1">{reporte.descripcion}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapaBase>
  );
};

export default MapaReportesMultiples;
