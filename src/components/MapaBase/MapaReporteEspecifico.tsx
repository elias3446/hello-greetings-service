import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { MapaBase, selectedReportIcon, RecenterAutomatically } from './MapaBase';
import { Reporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';

interface MapaReporteEspecificoProps {
  reporte: Reporte;
  className?: string;
  height?: string;
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

const MapaReporteEspecifico: React.FC<MapaReporteEspecificoProps> = ({
  reporte,
  className,
  height
}) => {
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);

  // Fetch address data when component mounts
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        setIsLoadingAddress(true);
        const { latitud: lat, longitud: lon } = reporte.ubicacion;
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
  }, [reporte.ubicacion]);

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
        hideSearchBar={true}
      >
        <RecenterAutomatically position={[reporte.ubicacion.latitud, reporte.ubicacion.longitud]} maxZoom={18} />
        
        <Marker 
          {...({ 
            position: [reporte.ubicacion.latitud, reporte.ubicacion.longitud], 
            icon: selectedReportIcon 
          } as any)}
        >
          <Popup>
            <div>
              <h3 className="font-medium text-lg">{reporte.titulo}</h3>
              {reporte.descripcion && <p className="text-sm mt-1">{reporte.descripcion}</p>}
            </div>
          </Popup>
        </Marker>
      </MapaBase>

      {reporte && (
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
                ({reporte.ubicacion.latitud.toFixed(6)}, {reporte.ubicacion.longitud.toFixed(6)})
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

export default MapaReporteEspecifico;
