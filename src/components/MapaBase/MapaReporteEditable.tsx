import React, { useState, useEffect, useCallback } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapaBase, selectedReportIcon, RecenterAutomatically } from './MapaBase';
import { Reporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';

interface MapaReporteEditableProps {
  reporte: Reporte;
  className?: string;
  height?: string;
  onPosicionActualizada?: (nuevaPos: [number, number]) => void;
}

interface AddressData {
  display_name: string;
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    suburb?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface FormattedAddress {
  mainAddress: string;
  reference: string;
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
      } as any)}
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
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);
  
  const handlePositionChange = useCallback((newPos: [number, number]) => {
    setPosition(newPos);
    if (onPosicionActualizada) {
      onPosicionActualizada(newPos);
    }
  }, [onPosicionActualizada]);

  // Fetch address data when position changes
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        setIsLoadingAddress(true);
        const [lat, lon] = position;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
        );
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setAddressData(data);
      } catch (error) {
        console.error("Error fetching address:", error);
        toast.error("No se pudo obtener la dirección");
        setAddressData(null);
      } finally {
        setIsLoadingAddress(false);
      }
    };
    
    fetchAddressData();
  }, [position]);

  // Format address for display
  const formatAddress = (): string | FormattedAddress => {
    if (!addressData) return "Obteniendo dirección...";
    
    const { address } = addressData;
    if (!address) return addressData.display_name;
    
    // Create main address line with complete display_name
    const mainAddress = addressData.display_name;
    
    // Create reference (area information)
    const reference = [
      address.suburb,
      address.city,
      address.state,
      address.country
    ].filter(Boolean).join(", ");
    
    return { mainAddress, reference };
  };

  // Get formatted address
  const formattedAddress = formatAddress();

  return (
    <div className="space-y-4">
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

      <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-2">Ubicación del reporte</h3>
        
        {isLoadingAddress ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : addressData ? (
          <div className="space-y-2">
            <div>
              <p className="font-medium">Dirección:</p>
              <p className="text-gray-700">
                {typeof formattedAddress === 'string' 
                  ? formattedAddress 
                  : (formattedAddress.mainAddress || "No disponible")}
              </p>
            </div>
            <div>
              <p className="font-medium">Referencia:</p>
              <p className="text-gray-700">
                {typeof formattedAddress === 'string' 
                  ? "" 
                  : (formattedAddress.reference || "No disponible")}
              </p>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              ({position[0].toFixed(6)}, {position[1].toFixed(6)})
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No se pudo obtener la información de la dirección</p>
        )}
      </div>
    </div>
  );
};

export default MapaReporteEditable;
