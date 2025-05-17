import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { MarkerProps } from 'react-leaflet';
import { MapaBase, selectedReportIcon, RecenterAutomatically } from './MapaBase';
import { Reporte } from '@/types/tipos';

interface MapaReporteEspecificoProps {
  reporte: Reporte;
  className?: string;
  height?: string;
}

const MapaReporteEspecifico: React.FC<MapaReporteEspecificoProps> = ({
  reporte,
  className,
  height
}) => {
  const position: [number, number] = [reporte.ubicacion.latitud, reporte.ubicacion.longitud];
  
  return (
    <MapaBase 
      className={className} 
      height={height}
      initialCenter={position}
      hideSearchBar={true} // Ocultamos la barra de búsqueda en este componente
    >
      <RecenterAutomatically position={position} maxZoom={18} />
      
      <Marker 
        {...({ 
          position, 
          icon: selectedReportIcon 
        } as MarkerProps)}
      >
        <Popup>
          <div>
            <h3 className="font-medium text-lg">{reporte.titulo}</h3>
            {reporte.descripcion && <p className="text-sm mt-1">{reporte.descripcion}</p>}
          </div>
        </Popup>
      </Marker>
    </MapaBase>
  );
};

export default MapaReporteEspecifico;
