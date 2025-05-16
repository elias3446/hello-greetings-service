/**
 * Utility functions for the SearchFilterBar component
 */

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formats any value to a meaningful string representation
 * Handles objects, dates, arrays and primitive values
 * 
 * @param value Any value to format
 * @returns A string representation of the value
 */
export const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    // If it's a Date object
    if (value instanceof Date) {
      // Format to "14 ene 2025" style
      return format(value, 'd MMM yyyy', { locale: es });
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      return value.map(item => formatValue(item)).join(', ');
    }
    
    // Try to convert objects to a meaningful string representation
    try {
      // Check for common properties that might represent the object's name or id
      if (value.name) return value.name;
      if (value.title) return value.title;
      if (value.label) return value.label;
      
      // For permission objects, extract only the permission name without prefix
      if (value.id && typeof value.id === 'string' && (
        value.id.startsWith('ver_') || 
        value.id.startsWith('editar_') || 
        value.id.startsWith('eliminar_') ||
        value.id.startsWith('crear_')
      )) {
        // Convert "ver_usuario" to "Ver usuario" (capitalize first letter and remove underscore)
        const parts = value.id.split('_');
        const action = parts[0];
        const resource = parts.slice(1).join(' ');
        return `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`;
      }
      
      // Regular ID handling
      if (value.id) return String(value.id);
      
      // If no meaningful property found, use JSON stringify with limited depth
      return JSON.stringify(value, null, 0).substring(0, 50);
    } catch (e) {
      return '[Complex Object]';
    }
  }
  
  // Return string for everything else
  return String(value);
};

/**
 * Checks if two date values match, handling various date formats
 * 
 * @param dateValue The date value to compare (can be Date object or string)
 * @param filterValue The filter value to compare against (usually a string)
 * @returns True if the dates match, false otherwise
 */
export const datesMatch = (dateValue: any, filterValue: string): boolean => {
  if (!dateValue || !filterValue) return false;
  
  try {
    // If it's already a Date object
    let dateObj: Date;
    
    if (dateValue instanceof Date) {
      dateObj = dateValue;
    } else if (typeof dateValue === 'string') {
      // Try to parse the string as a date
      dateObj = new Date(dateValue);
    } else {
      return false;
    }
    
    if (isNaN(dateObj.getTime())) {
      return false;
    }
    
    // Format the date to match the filter value format
    // Format to "14 ene 2025" style to match the display format
    const formattedDate = format(dateObj, 'd MMM yyyy', { locale: es });
    
    // Compare the formatted date with the filter value
    return formattedDate === filterValue;
  } catch (e) {
    console.error("Error comparing dates:", e);
    return false;
  }
};

/**
 * Compara un objeto con un valor de filtro
 * @param obj El objeto a comparar
 * @param filterValue El valor del filtro (puede ser string o número)
 * @returns boolean indicando si el objeto coincide con el filtro
 */
export function objectMatches(obj: any, filterValue: string): boolean {
  if (!obj || !filterValue) return false;

  // Si el objeto tiene una propiedad name, usarla para comparar
  if (obj.name) {
    return String(obj.name).toLowerCase() === filterValue.toLowerCase();
  }

  // Si el objeto tiene una propiedad id, usarla para comparar
  if (obj.id) {
    return String(obj.id) === filterValue;
  }

  // Si el objeto tiene una propiedad label, usarla para comparar
  if (obj.label) {
    return String(obj.label).toLowerCase() === filterValue.toLowerCase();
  }

  // Si el objeto tiene una propiedad value, usarla para comparar
  if (obj.value) {
    return String(obj.value) === filterValue;
  }

  // Si no encontramos propiedades comunes, intentar comparar el objeto completo
  try {
    const objStr = JSON.stringify(obj).toLowerCase();
    return objStr.includes(filterValue.toLowerCase());
  } catch (error) {
    return false;
  }
}
