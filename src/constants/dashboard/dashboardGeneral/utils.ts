import { EstadoReporte } from '@/types/tipos';

// Obtener todos los tipos únicos de estado
export const getAllTiposEstado = (estados: EstadoReporte[]): string[] => {
  const tiposUnicos = new Set<string>();
  estados.forEach(estado => {
    tiposUnicos.add(estado.nombre);
  });
  return Array.from(tiposUnicos);
};

// Función para formatear el tipo de estado para su visualización
export const formatearTipoEstado = (tipo: string): string => {
  // Convertir de snake_case a formato legible
  const palabras = tipo.split('_').map(palabra => 
    palabra.charAt(0).toUpperCase() + palabra.slice(1)
  );
  return palabras.join(' ');
}; 