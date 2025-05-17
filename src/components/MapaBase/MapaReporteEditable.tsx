import React, { useState, useEffect, useCallback } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import type { MarkerProps } from 'react-leaflet';
import { MapaBase, selectedReportIcon, RecenterAutomatically } from './MapaBase';
import { Reporte } from '@/types/tipos';

interface MapaReporteEditableProps {
  reporte: Reporte;
  className?: string;
  height?: string;
  onPosicionActualizada?: (nuevaPos: [number, number]) => void;
}

// Componente que maneja tanto el marcador arrastrable como los eventos de doble clic en el mapa
const EditableMarker: React.FC<{
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  title: string;
  description?: string;
}> = ({ position, setPosition, title, description }) => {
  // Capturar eventos del mapa, incluyendo el doble clic
  const map = useMapEvents({
    dblclick(e) {
      // Actualizar la posición al lugar donde se hizo doble clic
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
    }
  });

  // Manejar el arrastre del marcador
  const eventHandlers = {
    dragend(e: any) {
      const marker = e.target;
      const position = marker.getLatLng();
      setPosition([position.lat, position.lng]);
    }
  };

  return (
    <Marker 
      {...({ 
        position, 
        icon: selectedReportIcon,
        draggable: true,
        eventHandlers 
      } as MarkerProps)}
    >
      <Popup>
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          {description && <p className="text-sm mt-1">{description}</p>}
          <p className="text-xs mt-2 text-gray-500">Arrastre el marcador o haga doble clic en el mapa para actualizar la posición</p>
        </div>
      </Popup>
    </Marker>
  );
};

const MapaReporteEditable: React.FC<MapaReporteEditableProps> = ({
  reporte,
  className,
  height,
  onPosicionActualizada
}) => {
  const [position, setPosition] = useState<[number, number]>([reporte.ubicacion.latitud, reporte.ubicacion.longitud]);
  
  const handlePositionChange = useCallback((newPos: [number, number]) => {
    setPosition(newPos);
    if (onPosicionActualizada) {
      onPosicionActualizada(newPos);
    }
  }, [onPosicionActualizada]);

  return (
    <MapaBase 
      className={className} 
      height={height}
      initialCenter={[reporte.ubicacion.latitud, reporte.ubicacion.longitud]}
    >
      <RecenterAutomatically position={[reporte.ubicacion.latitud, reporte.ubicacion.longitud]} maxZoom={18} />
      
      <EditableMarker 
        position={position}
        setPosition={handlePositionChange}
        title={reporte.titulo}
        description={reporte.descripcion}
      />
    </MapaBase>
  );
};

export default MapaReporteEditable;
