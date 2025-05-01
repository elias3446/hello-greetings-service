
/**
 * Utilidades para la exportación de datos en diferentes formatos
 */

// Tipo para formatos de exportación
export type ExportFormat = 'csv' | 'json' | 'excel';

/**
 * Convierte un objeto a formato CSV
 * @param data Array de objetos para convertir
 * @param headers Cabeceras opcionales para el CSV
 * @returns String en formato CSV
 */
export const convertToCSV = (data: any[], headers?: Record<string, string>): string => {
  if (!data || data.length === 0) return '';
  
  // Si no se proporcionan cabeceras, usar las claves del primer objeto
  const headerKeys = headers ? Object.keys(headers) : Object.keys(data[0]);
  const headerValues = headers ? Object.values(headers) : headerKeys;
  
  // Crear la línea de cabeceras
  let csvContent = headerValues.join(',') + '\n';
  
  // Agregar los datos
  data.forEach(item => {
    const row = headerKeys.map(key => {
      let value = key.includes('.') 
        ? key.split('.').reduce((obj, i) => obj && obj[i], item) 
        : item[key];
      
      // Si es objeto convertir a string
      if (value !== null && typeof value === 'object') {
        if (value instanceof Date) {
          value = value.toISOString();
        } else {
          value = JSON.stringify(value);
        }
      }
      
      // Escapar comas y comillas
      if (value === null || value === undefined) {
        return '';
      } else {
        const valueStr = String(value);
        return valueStr.includes(',') || valueStr.includes('"') || valueStr.includes('\n') 
          ? '"' + valueStr.replace(/"/g, '""') + '"' 
          : valueStr;
      }
    });
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
};

/**
 * Convierte un objeto a formato JSON
 * @param data Datos para convertir
 * @returns String en formato JSON
 */
export const convertToJSON = (data: any): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * Descarga un archivo en el navegador
 * @param content Contenido del archivo
 * @param fileName Nombre del archivo
 * @param contentType Tipo de contenido (MIME)
 */
export const downloadFile = (
  content: string,
  fileName: string,
  contentType: string
): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  
  URL.revokeObjectURL(url);
};

/**
 * Exporta datos en formato CSV
 * @param data Datos para exportar
 * @param fileName Nombre del archivo
 * @param headers Cabeceras opcionales para el CSV
 */
export const exportToCSV = (
  data: any[],
  fileName: string,
  headers?: Record<string, string>
): void => {
  const csvContent = convertToCSV(data, headers);
  downloadFile(csvContent, `${fileName}.csv`, 'text/csv;charset=utf-8;');
};

/**
 * Exporta datos en formato JSON
 * @param data Datos para exportar
 * @param fileName Nombre del archivo
 */
export const exportToJSON = (data: any, fileName: string): void => {
  const jsonContent = convertToJSON(data);
  downloadFile(jsonContent, `${fileName}.json`, 'application/json;charset=utf-8;');
};

/**
 * Exporta datos en formato Excel (XLSX)
 * Esta función ahora exporta en formato CSV con extensión .csv,
 * que Excel puede abrir correctamente
 * @param data Datos para exportar
 * @param fileName Nombre del archivo
 * @param headers Cabeceras opcionales para el archivo
 */
export const exportToExcel = (
  data: any[],
  fileName: string,
  headers?: Record<string, string>
): void => {
  // Usamos CSV que Excel puede abrir correctamente
  const csvContent = convertToCSV(data, headers);
  downloadFile(csvContent, `${fileName}.csv`, 'application/vnd.ms-excel;charset=utf-8;');
};

/**
 * Función genérica para exportar datos en diferentes formatos
 * @param data Datos para exportar
 * @param fileName Nombre del archivo
 * @param format Formato de exportación (csv, json, excel)
 * @param headers Cabeceras opcionales para el archivo
 */
export const exportData = (
  data: any[],
  fileName: string,
  format: ExportFormat,
  headers?: Record<string, string>
): void => {
  switch (format) {
    case 'csv':
      exportToCSV(data, fileName, headers);
      break;
    case 'json':
      exportToJSON(data, fileName);
      break;
    case 'excel':
      exportToExcel(data, fileName, headers);
      break;
    default:
      console.error('Formato de exportación no válido');
  }
};
