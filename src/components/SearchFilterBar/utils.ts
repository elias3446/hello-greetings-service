
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
  
  // Para valores calculados que son funciones
  if (typeof value === 'function') {
    try {
      // Intentar ejecutar la función sin parámetros si es posible
      const result = value();
      // Formatear el resultado de la función
      return formatValue(result);
    } catch (e) {
      // Si no se puede ejecutar, mostrar que es un valor calculado
      return '[Valor calculado]';
    }
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
      
      // Check if the array contains permission-like objects
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        // Si los elementos tienen una propiedad 'nombre', extraer y unir
        if (value[0].nombre && typeof value[0].nombre === 'string') {
          // Return comma-separated list of permission names
          return value.map(item => item.nombre).join(', ');
        }
        
        // Si los elementos tienen una propiedad 'id' con formato de permiso
        if (value[0].id && typeof value[0].id === 'string' && value[0].id.includes('_')) {
          // Formatear los permisos con formato "Acción Recurso"
          return value.map(item => {
            const parts = item.id.split('_');
            const action = parts[0];
            const resource = parts.slice(1).join(' ');
            return `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`;
          }).join(', ');
        }
      }
      
      return value.map(item => formatValue(item)).join(', ');
    }
    
    // Try to convert objects to a meaningful string representation
    try {
      // Handle permission objects with specific properties
      // Primary check for objects with nombre property which should be displayed
      if (value.nombre && typeof value.nombre === 'string') {
        return value.nombre;
      }
      
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
      // Avoid returning entire JSON object
      return '[Objeto]';
    } catch (e) {
      console.error("Error formatting object:", e);
      return '[Objeto]';
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
 * Split a search term into individual parts, handling both comma-separated and space-separated forms
 * 
 * @param searchTerm The search term to split (e.g., "Ver Usuario, Crear Usuario" or "Ver Usuario Crear Usuario")
 * @returns Array of individual terms
 */
export const splitSearchTerms = (searchTerm: string): string[] => {
  // First, check if there are commas, indicating an explicit list
  if (searchTerm.includes(',')) {
    return searchTerm.split(',')
      .map(term => term.trim())
      .filter(term => term.length > 0);
  }
  
  // Handle potential permission-like formats without commas (e.g., "Ver Usuario Crear Usuario")
  const permissionPrefixes = ['ver', 'crear', 'editar', 'eliminar'];
  
  // Check if the search term might contain multiple permissions without commas
  const words = searchTerm.split(' ');
  const terms: string[] = [];
  let currentTerm = '';
  
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    
    // If this word is a permission prefix and we already have a term started,
    // it likely indicates the start of a new permission
    if (permissionPrefixes.includes(lowerWord) && currentTerm) {
      terms.push(currentTerm.trim());
      currentTerm = word;
    } else {
      // Otherwise, append to the current term
      if (currentTerm) currentTerm += ' ' + word;
      else currentTerm = word;
    }
  }
  
  // Add the last term if there is one
  if (currentTerm) {
    terms.push(currentTerm.trim());
  }
  
  return terms;
};

/**
 * Helper function to check if an object matches a filter value
 * This function is crucial for filtering objects correctly
 * 
 * @param objValue The object value to check
 * @param filterValue The filter value to match
 * @returns True if the object matches the filter, false otherwise
 */
export const objectMatches = (objValue: any, filterValue: string): boolean => {
  if (!objValue || typeof objValue !== 'object') return false;
  
  // Para valores calculados que son funciones
  if (typeof objValue === 'function') {
    try {
      // Intentar ejecutar la función sin parámetros si es posible
      const result = objValue();
      // Usar el resultado para comparar
      return objectMatches(result, filterValue) || formatValue(result) === filterValue;
    } catch (e) {
      return false;
    }
  }
  
  try {
    // Split the filter value into parts in case it's a comma-separated or space-separated list
    const filterParts = splitSearchTerms(filterValue);
    
    // If there are multiple terms, check if any match
    if (filterParts.length > 1) {
      return filterParts.some(part => objectMatches(objValue, part));
    }
    
    // Special handling for arrays of objects (like multiple permissions)
    if (Array.isArray(objValue)) {
      // Check if any item in the array matches the filter value
      return objValue.some(item => {
        if (typeof item === 'object' && item !== null) {
          // If it has a nombre property, use that
          if (item.nombre && typeof item.nombre === 'string') {
            return item.nombre === filterValue;
          }
          
          // For permission objects with id
          if (item.id && typeof item.id === 'string' && (
            item.id.startsWith('ver_') || 
            item.id.startsWith('editar_') || 
            item.id.startsWith('eliminar_') ||
            item.id.startsWith('crear_')
          )) {
            // Format the permission and compare
            const parts = item.id.split('_');
            const action = parts[0];
            const resource = parts.slice(1).join(' ');
            const formattedPermission = `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`;
            return formattedPermission === filterValue;
          }
          
          // Generic string comparison for other objects
          return String(item) === filterValue;
        }
        return String(item) === filterValue;
      });
    }
    
    // First, check if the formatted representation matches the filter value
    const formattedValue = formatValue(objValue);
    if (formattedValue === filterValue) {
      return true;
    }
    
    // Special handling for objects with nombre property
    if (objValue.nombre && typeof objValue.nombre === 'string') {
      return objValue.nombre === filterValue;
    }
    
    // Special handling for permission objects
    if (objValue.id && typeof objValue.id === 'string' && (
      objValue.id.startsWith('ver_') || 
      objValue.id.startsWith('editar_') || 
      objValue.id.startsWith('eliminar_') ||
      objValue.id.startsWith('crear_')
    )) {
      // Check if the filter value matches the nombre property directly
      if (objValue.nombre && typeof objValue.nombre === 'string') {
        return objValue.nombre === filterValue;
      }
      
      // Get the formatted value that would be displayed in the UI
      const parts = objValue.id.split('_');
      const action = parts[0];
      const resource = parts.slice(1).join(' ');
      const formattedPermission = `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`;
      
      // Compare with the filter value
      return formattedPermission === filterValue;
    }
    
    // For other objects, try string comparison as fallback
    return String(objValue) === filterValue;
  } catch (e) {
    console.error("Error comparing objects:", e);
    return false;
  }
};

/**
 * Function to check if a calculated value (function) matches a filter
 * This is specifically for handling function values in tables
 * 
 * @param funcValue The function to evaluate
 * @param filterValue The value to filter against
 * @returns True if the calculated value matches the filter
 */
export const calculatedValueMatches = (funcValue: Function, filterValue: string): boolean => {
  if (typeof funcValue !== 'function') return false;
  
  try {
    // Execute the function to get its result
    const result = funcValue();
    
    // If the result is a primitive type (number, string, etc.)
    if (typeof result !== 'object' || result === null) {
      return String(result).toLowerCase().includes(filterValue.toLowerCase());
    }
    
    // If the result is an object (including arrays)
    const formattedResult = formatValue(result).toLowerCase();
    return formattedResult.includes(filterValue.toLowerCase());
  } catch (e) {
    console.error("Error evaluating function for filtering:", e);
    return false;
  }
};