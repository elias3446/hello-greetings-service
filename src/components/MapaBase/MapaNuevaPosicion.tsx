import React, { useState, useEffect, useCallback } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapaBase, selectedReportIcon, RecenterAutomatically } from './MapaBase';
import { toast } from '@/components/ui/sonner';

interface MapaNuevaPosicionProps {
  className?: string;
  height?: string;
  onPosicionSeleccionada?: (pos: [number, number]) => void;
  initialPosition?: [number, number];
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
      {...({ 
        position, 
        icon: selectedReportIcon 
      } as any)}
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
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);
  
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

  // Fetch address data when position changes
  useEffect(() => {
    const fetchAddressData = async () => {
      if (!selectedPosition) return;
      
      try {
        setIsLoadingAddress(true);
        const [lat, lon] = selectedPosition;
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
  }, [selectedPosition]);

  const handlePositionChange = useCallback((newPos: [number, number]) => {
    setSelectedPosition(newPos);
    if (onPosicionSeleccionada) {
      onPosicionSeleccionada(newPos);
    }
  }, [onPosicionSeleccionada]);

  // Format address for display
  const formatAddress = (): string | FormattedAddress => {
    if (!addressData) return "Obteniendo dirección...";
    
    const { address } = addressData;
    if (!address) return addressData.display_name;
    
    // Create main address line (now with the complete display_name)
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
        initialCenter={userPosition[0] !== 0 ? userPosition : undefined}
      >
        {userPosition[0] !== 0 && <RecenterAutomatically position={userPosition} maxZoom={18} />}
        
        <ClickableMap 
          position={selectedPosition}
          setPosition={handlePositionChange}
        />
      </MapaBase>

      {selectedPosition && (
        <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-2">Ubicación seleccionada</h3>
          
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
                ({selectedPosition[0].toFixed(6)}, {selectedPosition[1].toFixed(6)})
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No se pudo obtener la información de la dirección</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapaNuevaPosicion;
