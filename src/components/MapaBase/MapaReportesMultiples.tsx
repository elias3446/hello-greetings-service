import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { MapaBase, reportIcon, RecenterAutomatically } from './MapaBase';
import { Reporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';

interface MapaReportesMultiplesProps {
  reportes: Reporte[];
  className?: string;
  height?: string;
  onReporteClick?: (reporte: Reporte) => void;
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

const MapaReportesMultiples: React.FC<MapaReportesMultiplesProps> = ({
  reportes,
  className,
  height,
  onReporteClick
}) => {
  const [userPosition, setUserPosition] = useState<[number, number]>([0, 0]);
  const [selectedReporte, setSelectedReporte] = useState<Reporte | null>(null);
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

  // Fetch address data when a report is selected
  useEffect(() => {
    const fetchAddressData = async () => {
      if (!selectedReporte) {
        setAddressData(null);
        return;
      }
      
      try {
        setIsLoadingAddress(true);
        const { latitud: lat, longitud: lon } = selectedReporte.ubicacion;
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
  }, [selectedReporte]);

  const handleMarkerClick = (reporte: Reporte) => {
    // Set the selected report
    setSelectedReporte(reporte);
    
    // Call the parent component's handler if provided
    if (onReporteClick) {
      onReporteClick(reporte);
    }
  };

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
        initialCenter={userPosition[0] !== 0 ? userPosition : undefined}
      >
        {/* Center on user position initially */}
        {userPosition[0] !== 0 && !selectedReporte && 
          <RecenterAutomatically position={userPosition} maxZoom={18} />
        }
        
        {/* Center on selected report when clicked */}
        {selectedReporte && 
          <RecenterAutomatically position={[selectedReporte.ubicacion.latitud, selectedReporte.ubicacion.longitud]} maxZoom={18} />
        }
        
        {reportes.map((reporte) => (
          <Marker 
            key={reporte.id} 
            {...({ 
              position: [reporte.ubicacion.latitud, reporte.ubicacion.longitud],
              icon: reportIcon,
              eventHandlers: {
                click: () => handleMarkerClick(reporte),
              }
            } as any)}
          >
            <Popup>
              <div>
                <h3 className="font-medium text-lg">{reporte.titulo}</h3>
                {reporte.descripcion && <p className="text-sm mt-1">{reporte.descripcion}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapaBase>

      {selectedReporte && (
        <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-2">Reporte seleccionado: {selectedReporte.titulo}</h3>
          
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
                ({selectedReporte.ubicacion.latitud.toFixed(6)}, {selectedReporte.ubicacion.longitud.toFixed(6)})
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No se pudo obtener la información de la dirección</p>
          )}
          
          {selectedReporte.descripcion && (
            <div className="mt-3">
              <p className="font-medium">Descripción:</p>
              <p className="text-gray-700">{selectedReporte.descripcion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapaReportesMultiples;
