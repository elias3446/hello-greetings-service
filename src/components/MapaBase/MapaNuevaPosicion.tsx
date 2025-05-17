import React, { useState, useEffect, useCallback } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import type { MarkerProps } from 'react-leaflet';
import { MapaBase, selectedReportIcon, RecenterAutomatically } from './MapaBase';

interface MapaNuevaPosicionProps {
  className?: string;
  height?: string;
  onPosicionSeleccionada?: (pos: [number, number]) => void;
  initialPosition?: [number, number];
}

const ClickableMap: React.FC<{
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}> = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? (
    <Marker 
      {...({ position, icon: selectedReportIcon } as MarkerProps)}
    >
      <Popup>
        <div>
          <h3 className="font-medium">Posición seleccionada</h3>
          <p className="text-xs mt-1">{position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
          <p className="text-xs mt-2 text-gray-500">Haga clic en otro lugar para cambiar</p>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

const MapaNuevaPosicion: React.FC<MapaNuevaPosicionProps> = ({
  className,
  height,
  onPosicionSeleccionada,
  initialPosition
}) => {
  const [userPosition, setUserPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(
    initialPosition || null
  );
  
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

  const handlePositionChange = useCallback((newPos: [number, number]) => {
    setSelectedPosition(newPos);
    if (onPosicionSeleccionada) {
      onPosicionSeleccionada(newPos);
    }
  }, [onPosicionSeleccionada]);

  return (
    <MapaBase 
      className={className} 
      height={height}
      initialCenter={userPosition[0] !== 0 ? userPosition : undefined}
    >
      {userPosition[0] !== 0 && <RecenterAutomatically position={userPosition} maxZoom={18} />}
      
      <ClickableMap 
        position={selectedPosition}
        setPosition={handlePositionChange}
      />
    </MapaBase>
  );
};

export default MapaNuevaPosicion;
