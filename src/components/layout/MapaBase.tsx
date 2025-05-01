
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Reporte } from '@/types/tipos';
import SearchBar from '@/components/SearchBar';
import { LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define blue icon for user location
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapaBaseProps {
  reportes: Reporte[];
  onReporteSelect?: (reporte: Reporte) => void;
  altura?: string;
  onMapClick?: (lat: number, lng: number) => void;
  mostrarMarcadorSeleccion?: boolean;
  ubicacionSeleccionada?: {
    latitud: number;
    longitud: number;
    direccion?: string;
  } | null;
  tooltipContent?: string;
  initialUserPosition?: [number, number] | null;
  initialPosition?: [number, number];
  forceInitialPosition?: boolean;
}

// Component to handle map clicks
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to set initial view
function SetInitialView({ 
  center, 
  zoom,
  userPosition,
  forceCenter = false 
}: { 
  center: [number, number], 
  zoom: number,
  userPosition?: [number, number] | null,
  forceCenter?: boolean
}) {
  const map = useMap();
  
  useEffect(() => {
    // Si hay un centro forzado, usarlo siempre
    if (forceCenter) {
      map.setView(center, zoom);
    }
    // Si no es forzado, priorizar la ubicación del usuario
    else if (userPosition) {
      map.setView(userPosition, zoom);
    } 
    // Si no hay ubicación del usuario ni es forzado, usar el centro predeterminado
    else {
      map.setView(center, zoom);
    }
  }, [center, zoom, map, userPosition, forceCenter]);
  
  return null;
}

function ResetMarkerPosition() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

const MapaBase = ({ 
  reportes, 
  onReporteSelect, 
  altura = "500px",
  onMapClick,
  mostrarMarcadorSeleccion = false,
  ubicacionSeleccionada,
  tooltipContent,
  initialUserPosition,
  initialPosition,
  forceInitialPosition = false,
}: MapaBaseProps) => {
  const defaultPosition: [number, number] = [-0.1806532, -78.4678382]; // Quito
  // Solo inicializamos userPosition si no estamos forzando una posición inicial
  // Esto evita que la ubicación del usuario interfiera con la vista del mapa
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    forceInitialPosition ? null : initialUserPosition || null
  );
  const [map, setMap] = useState<L.Map | null>(null);

  // Determinar la posición inicial según la prioridad:
  // 1. Posición inicial forzada si se especifica
  // 2. Posición del primer reporte si hay reportes
  // 3. Posición por defecto
  const centerPosition: [number, number] = initialPosition 
    ? initialPosition
    : reportes.length === 1
      ? [reportes[0].ubicacion.latitud, reportes[0].ubicacion.longitud]
      : defaultPosition;

  useEffect(() => {
    // Si estamos forzando una posición inicial, no obtenemos la posición del usuario
    if (forceInitialPosition) return;
    
    // Si ya tenemos la posición inicial del usuario, no la volvemos a obtener
    if (initialUserPosition) {
      setUserPosition(initialUserPosition);
      return;
    }
    
    if (navigator.geolocation && !userPosition) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Solo actualizamos la posición del usuario si no estamos forzando una posición inicial
          if (!forceInitialPosition) {
            const newPosition: [number, number] = [
              position.coords.latitude, 
              position.coords.longitude
            ];
            setUserPosition(newPosition);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, [initialUserPosition, userPosition, forceInitialPosition]);

  // Efecto para centrar el mapa cuando cambia la ubicación del reporte
  // Solo se aplica si no estamos forzando una posición inicial
  useEffect(() => {
    if (map && initialPosition && forceInitialPosition) {
      map.setView(initialPosition, 16);
    }
    else if (map && reportes.length === 1 && !forceInitialPosition && !initialPosition) {
      const reporte = reportes[0];
      map.setView(
        [reporte.ubicacion.latitud, reporte.ubicacion.longitud],
        16
      );
    }
  }, [map, reportes, forceInitialPosition, initialPosition]);

  // Efecto para centrar el mapa cuando obtenemos la posición del usuario
  // Solo se aplica si no hay reportes y no estamos forzando una posición inicial
  useEffect(() => {
    if (map && userPosition && !reportes.length && !forceInitialPosition && !initialPosition) {
      map.setView(userPosition, 16);
    }
  }, [map, userPosition, reportes.length, forceInitialPosition, initialPosition]);

  const centerOnUserLocation = (e: React.MouseEvent) => {
    // Importante: Evitar que se propague el evento para que no se envíe el formulario
    e.preventDefault();
    e.stopPropagation();
    
    if (userPosition && map) {
      map.setView(userPosition, 16);
    }
  };

  const handleSearch = (location: { lat: number; lon: number; display_name: string }) => {
    if (map) {
      map.setView([location.lat, location.lon], 16);
    }
  };

  const handleReporteClick = (reporte: Reporte) => {
    if (onReporteSelect) {
      onReporteSelect(reporte);
    }
  };

  return (
    <Card className="relative z-[1]">
      <CardContent className="p-4">
        <div className="w-full rounded-md overflow-hidden relative" style={{ height: altura }}>
          <MapContainer 
            style={{ height: '100%', width: '100%' }}
            className="z-[2]"
            ref={setMap}
          >
            <SetInitialView 
              center={centerPosition} 
              zoom={16}
              userPosition={forceInitialPosition ? null : userPosition}
              forceCenter={forceInitialPosition} 
            />
            <SearchBar 
              onSearch={handleSearch}
              userPosition={userPosition}
            />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ResetMarkerPosition />
            {onMapClick && <MapClickHandler onClick={onMapClick} />}
            
            {reportes.map((reporte) => (
              <Marker
                key={reporte.id}
                position={[
                  reporte.ubicacion.latitud || defaultPosition[0],
                  reporte.ubicacion.longitud || defaultPosition[1]
                ]}
                eventHandlers={{
                  click: () => handleReporteClick(reporte),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">{reporte.titulo}</h3>
                    <p className="text-sm text-gray-500">{reporte.ubicacion.direccion}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {mostrarMarcadorSeleccion && ubicacionSeleccionada && (
              <Marker
                position={[ubicacionSeleccionada.latitud, ubicacionSeleccionada.longitud]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">Ubicación seleccionada</h3>
                    <p className="text-sm text-gray-500">
                      {tooltipContent || ubicacionSeleccionada.direccion || `${ubicacionSeleccionada.latitud}, ${ubicacionSeleccionada.longitud}`}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {userPosition && !forceInitialPosition && (
              <Marker
                position={userPosition}
                // @ts-ignore - We need to ignore this because the type definitions are incorrect
                icon={userLocationIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">Tu ubicación</h3>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
          
          {userPosition && !forceInitialPosition && (
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute bottom-4 right-4 z-[1000]"
              onClick={centerOnUserLocation}
              title="Centrar en mi ubicación"
              type="button" // Añadimos explícitamente el tipo button para evitar el envío del formulario
            >
              <LocateFixed className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapaBase;
