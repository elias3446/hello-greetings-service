
import React, { useState, useEffect } from 'react';
import MapaBase from '@/components/layout/MapaBase';
import { toast } from '@/components/ui/sonner';

interface MapaSeleccionUbicacionProps {
  onUbicacionSeleccionada: (ubicacion: {
    latitud: number;
    longitud: number;
    direccion: string;
    referencia: string;
    id?: string;
    fechaCreacion?: Date;
    activo?: boolean;
  }) => void;
  ubicacionInicial?: {
    latitud: number;
    longitud: number;
    direccion: string;
    referencia: string;
    id?: string;
    fechaCreacion?: Date;
    activo?: boolean;
  };
  userPosition?: [number, number] | null;
}

const MapaSeleccionUbicacion = ({
  onUbicacionSeleccionada,
  ubicacionInicial,
  userPosition,
}: MapaSeleccionUbicacionProps) => {
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<{
    latitud: number;
    longitud: number;
    direccion: string;
    referencia: string;
    id?: string;
    fechaCreacion?: Date;
    activo?: boolean;
  } | null>(ubicacionInicial || null);
  
  // Nuevo estado para controlar si ya se utilizó la ubicación del usuario
  const [userPositionUsed, setUserPositionUsed] = useState(false);

  // Actualizamos cuando cambia la ubicación inicial
  useEffect(() => {
    if (ubicacionInicial) {
      setUbicacionSeleccionada(ubicacionInicial);
    }
  }, [ubicacionInicial]);

  // Si tenemos la posición del usuario y no hay ubicación seleccionada,
  // establecemos la posición del usuario como ubicación inicial SOLO UNA VEZ
  useEffect(() => {
    // Solo ejecutamos esto si no se ha usado la posición del usuario antes
    // y no hay ubicación seleccionada ni inicial
    if (userPosition && !ubicacionSeleccionada && !ubicacionInicial && !userPositionUsed) {
      obtenerDireccion(userPosition[0], userPosition[1])
        .then(direccion => {
          const nuevaUbicacion = {
            latitud: userPosition[0],
            longitud: userPosition[1],
            direccion,
            referencia: `Punto seleccionado en ${direccion}`,
            id: crypto.randomUUID(),
            fechaCreacion: new Date(),
            activo: true
          };
          setUbicacionSeleccionada(nuevaUbicacion);
          onUbicacionSeleccionada(nuevaUbicacion);
          // Marcamos que ya hemos utilizado la posición del usuario
          setUserPositionUsed(true);
          toast.success('Ubicación inicial establecida en tu posición actual');
        })
        .catch(error => {
          console.error('Error al obtener la dirección:', error);
          // Incluso si hay un error, marcamos que ya intentamos usar la posición del usuario
          setUserPositionUsed(true);
        });
    }
  }, [userPosition, ubicacionSeleccionada, ubicacionInicial, onUbicacionSeleccionada, userPositionUsed]);

  const obtenerDireccion = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener la dirección');
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      return `${lat}, ${lng}`;
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      return `${lat}, ${lng}`;
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      // Primero mostramos un estado de carga en el tooltip
      const ubicacionTemporal = {
        latitud: lat,
        longitud: lng,
        direccion: 'Obteniendo dirección...',
        referencia: 'Cargando...',
        id: ubicacionSeleccionada?.id || crypto.randomUUID(),
        fechaCreacion: ubicacionSeleccionada?.fechaCreacion || new Date(),
        activo: ubicacionSeleccionada?.activo !== undefined ? ubicacionSeleccionada.activo : true
      };
      
      setUbicacionSeleccionada(ubicacionTemporal);
      
      // Obtenemos la dirección
      const direccion = await obtenerDireccion(lat, lng);
      
      // Actualizamos con la dirección real
      const nuevaUbicacion = {
        ...ubicacionTemporal,
        direccion: direccion,
        referencia: `Punto seleccionado en ${direccion}`,
      };
      
      // Actualizamos el estado local y notificamos al componente padre
      setUbicacionSeleccionada(nuevaUbicacion);
      onUbicacionSeleccionada(nuevaUbicacion);
      
      toast.success('Ubicación seleccionada correctamente');
    } catch (error) {
      console.error('Error al seleccionar ubicación:', error);
      toast.error('No se pudo obtener la dirección');
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-[400px] w-full rounded-lg overflow-hidden border">
        <MapaBase
          reportes={[]}
          onMapClick={handleMapClick}
          altura="400px"
          mostrarMarcadorSeleccion={true}
          ubicacionSeleccionada={ubicacionSeleccionada}
          tooltipContent={ubicacionSeleccionada?.direccion}
          initialUserPosition={userPosition}
          // Si hay ubicación seleccionada, usamos sus coordenadas como posición inicial
          initialPosition={ubicacionSeleccionada ? [ubicacionSeleccionada.latitud, ubicacionSeleccionada.longitud] : undefined}
          // Solo forzamos la posición inicial si hay una ubicación seleccionada
          forceInitialPosition={!!ubicacionSeleccionada}
        />
      </div>
      {ubicacionSeleccionada && (
        <div className="p-3 bg-muted/50 rounded-md">
          <p className="text-sm font-medium">Ubicación seleccionada:</p>
          <p className="text-sm text-muted-foreground">{ubicacionSeleccionada.direccion}</p>
        </div>
      )}
    </div>
  );
};

export default MapaSeleccionUbicacion;
