import { createUser } from '@/controller/CRUD/user/userController';
import { crearReporte } from '@/controller/CRUD/report/reportController';
import { createCategory } from '@/controller/CRUD/category/categoryController';
import { crearRol } from '@/controller/CRUD/role/roleController';
import { createEstado } from '@/controller/CRUD/estado/estadoController';
import { crearUsuario } from '@/controller/controller/user/newUser';
import { TipoEntidad } from '@/types/tipos';

// Definición de campos por tipo de entidad
export interface Field {
  key: string;
  label: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'object';
  validate?: (value: any) => string | null;
}

export const getFieldsForEntityType = (tipoEntidad: TipoEntidad): Field[] => {
  switch (tipoEntidad) {
    case 'usuarios':
      return [
        { key: 'nombre', label: 'Nombre', required: true, type: 'string' },
        { key: 'apellido', label: 'Apellido', required: true, type: 'string' },
        { key: 'email', label: 'Email', required: true, type: 'email',
          validate: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? null : 'Formato de email inválido';
          }
        },
        { key: 'password', label: 'Contraseña', required: true, type: 'string',
          validate: (value) => {
            return value.length >= 6 ? null : 'La contraseña debe tener al menos 6 caracteres';
          }
        },
        { key: 'estado', label: 'Estado', required: true, type: 'string',
          validate: (value) => {
            const validStates = ['activo', 'inactivo', 'bloqueado'];
            return validStates.includes(value) ? null : 'Estado no válido (activo, inactivo, bloqueado)';
          }
        },
        { key: 'tipo', label: 'Tipo', required: true, type: 'string',
          validate: (value) => {
            const validTypes = ['admin', 'usuario'];
            return validTypes.includes(value) ? null : 'Tipo no válido (admin, usuario)';
          }
        },
        { key: 'rolId', label: 'ID del Rol', required: true, type: 'string' }
      ];
    
    case 'reportes':
      return [
        { key: 'titulo', label: 'Título', required: true, type: 'string' },
        { key: 'descripcion', label: 'Descripción', required: true, type: 'string' },
        { key: 'direccion', label: 'Dirección', required: true, type: 'string' },
        { key: 'latitud', label: 'Latitud', required: true, type: 'number',
          validate: (value) => {
            const lat = parseFloat(value);
            return !isNaN(lat) && lat >= -90 && lat <= 90 ? null : 'Latitud debe estar entre -90 y 90';
          }
        },
        { key: 'longitud', label: 'Longitud', required: true, type: 'number',
          validate: (value) => {
            const lng = parseFloat(value);
            return !isNaN(lng) && lng >= -180 && lng <= 180 ? null : 'Longitud debe estar entre -180 y 180';
          }
        },
        { key: 'categoriaId', label: 'ID de Categoría', required: true, type: 'string' },
        { key: 'estadoId', label: 'ID de Estado', required: true, type: 'string' },
        { key: 'usuarioId', label: 'ID de Usuario asignado', required: false, type: 'string' },
        { key: 'fechaInicio', label: 'Fecha de Inicio', required: true, type: 'date' }
      ];
    
    case 'categorias':
      return [
        { key: 'nombre', label: 'Nombre', required: true, type: 'string' },
        { key: 'descripcion', label: 'Descripción', required: false, type: 'string' },
        { key: 'color', label: 'Color', required: true, type: 'string',
          validate: (value) => {
            const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            return hexColorRegex.test(value) ? null : 'Formato de color inválido (ej: #FF5733)';
          }
        },
        { key: 'icono', label: 'Icono', required: true, type: 'string' },
        { key: 'tipo', label: 'Tipo', required: true, type: 'string',
          validate: (value) => {
            const validTypes = ['admin', 'usuario'];
            return validTypes.includes(value) ? null : 'Tipo no válido (admin, usuario)';
          }
        }
      ];
    
    case 'roles':
      return [
        { key: 'nombre', label: 'Nombre', required: true, type: 'string' },
        { key: 'descripcion', label: 'Descripción', required: false, type: 'string' },
        { key: 'color', label: 'Color', required: true, type: 'string',
          validate: (value) => {
            const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            return hexColorRegex.test(value) ? null : 'Formato de color inválido (ej: #FF5733)';
          }
        },
        { key: 'tipo', label: 'Tipo', required: true, type: 'string',
          validate: (value) => {
            const validTypes = ['admin', 'usuario'];
            return validTypes.includes(value) ? null : 'Tipo no válido (admin, usuario)';
          }
        }
      ];
    
    case 'estados':
      return [
        { key: 'nombre', label: 'Nombre', required: true, type: 'string' },
        { key: 'descripcion', label: 'Descripción', required: false, type: 'string' },
        { key: 'color', label: 'Color', required: true, type: 'string',
          validate: (value) => {
            const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            return hexColorRegex.test(value) ? null : 'Formato de color inválido (ej: #FF5733)';
          }
        },
        { key: 'icono', label: 'Icono', required: true, type: 'string' },
        { key: 'tipo', label: 'Tipo', required: true, type: 'string',
          validate: (value) => {
            const validTypes = ['pendiente', 'en_progreso', 'completado', 'cancelado'];
            return validTypes.includes(value) ? null : 'Tipo de estado no válido (pendiente, en_progreso, completado, cancelado)';
          }
        }
      ];
    
    default:
      return [];
  }
};

// Función para procesar archivos
export const procesarArchivo = async (
  file: File,
  fileType: 'csv' | 'excel' | 'json',
  tipoEntidad: TipoEntidad,
  isValidation: boolean = true
): Promise<any> => {
  // Leer el archivo según su tipo
  let rawData: any[] = await readFile(file, fileType);
  
  // Agregar índice de fila para referencia de errores
  rawData = rawData.map((record, index) => ({ ...record, __rowIndex: index }));
  
  // Obtener definición de campos para el tipo de entidad
  const fields = getFieldsForEntityType(tipoEntidad);
  
  // Validar los datos
  const validationErrors: Array<{ row: number; field: string; message: string }> = [];
  
  for (const record of rawData) {
    // Validar campos requeridos y tipos de datos
    for (const field of fields) {
      const value = record[field.key];
      
      // Validar campos requeridos
      if (field.required && (value === undefined || value === null || value === '')) {
        validationErrors.push({
          row: record.__rowIndex,
          field: field.key,
          message: `El campo '${field.label}' es requerido`
        });
        continue;
      }
      
      // Si el campo tiene valor, validar tipo y reglas específicas
      if (value !== undefined && value !== null && value !== '') {
        // Validar tipo de dato
        switch (field.type) {
          case 'number':
            if (isNaN(Number(value))) {
              validationErrors.push({
                row: record.__rowIndex,
                field: field.key,
                message: `El campo '${field.label}' debe ser un número`
              });
            }
            break;
          
          case 'boolean':
            if (typeof value !== 'boolean' && value !== 'true' && value !== 'false' && value !== '1' && value !== '0') {
              validationErrors.push({
                row: record.__rowIndex,
                field: field.key,
                message: `El campo '${field.label}' debe ser un valor booleano`
              });
            }
            break;
          
          case 'date':
            if (isNaN(Date.parse(value))) {
              validationErrors.push({
                row: record.__rowIndex,
                field: field.key,
                message: `El campo '${field.label}' debe ser una fecha válida`
              });
            }
            break;
        }
        
        // Validar reglas específicas si existe función de validación
        if (field.validate) {
          const validationResult = field.validate(value);
          if (validationResult) {
            validationErrors.push({
              row: record.__rowIndex,
              field: field.key,
              message: validationResult
            });
          }
        }
      }
    }
  }
  
  // Si es solo validación, devolver los datos y errores
  if (isValidation) {
    return {
      data: rawData,
      validationErrors
    };
  }
  
  // Si es importación, proceder a importar los datos válidos
  const successRecords: any[] = [];
  const failedRecords: any[] = [];
  
  for (const record of rawData) {
    // Verificar si el registro tiene errores
    const hasErrors = validationErrors.some(error => error.row === record.__rowIndex);
    
    if (!hasErrors) {
      try {
        // Procesar según el tipo de entidad
        const cleanRecord = { ...record };
        delete cleanRecord.__rowIndex; // Eliminar el campo interno
        
        // Crear el registro en el sistema
        const result = await createEntityRecord(cleanRecord, tipoEntidad);
        
        if (result) {
          successRecords.push(record);
        } else {
          record.error = 'Error al crear el registro en el sistema';
          failedRecords.push(record);
        }
      } catch (error) {
        record.error = error instanceof Error ? error.message : 'Error desconocido';
        failedRecords.push(record);
      }
    } else {
      // Obtener todos los errores del registro
      const recordErrors = validationErrors
        .filter(error => error.row === record.__rowIndex)
        .map(error => error.message)
        .join('; ');
      
      record.error = recordErrors;
      failedRecords.push(record);
    }
  }
  
  return {
    successRecords,
    failedRecords,
    totalRecords: rawData.length
  };
};

// Función para leer archivos según su tipo
const readFile = async (file: File, fileType: 'csv' | 'excel' | 'json'): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const result = event.target?.result as string;
        
        switch (fileType) {
          case 'csv':
            resolve(parseCSV(result));
            break;
          
          case 'excel':
            // En una implementación real, se usaría una biblioteca como xlsx
            // En este simulador, tratamos el Excel como CSV por simplicidad
            resolve(parseCSV(result));
            break;
          
          case 'json':
            resolve(JSON.parse(result));
            break;
          
          default:
            reject(new Error('Tipo de archivo no soportado'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    if (fileType === 'json') {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  });
};

// Función para parsear CSV
const parseCSV = (csv: string): any[] => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(value => value.trim());
    const obj: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    
    result.push(obj);
  }
  
  return result;
};

// Función para crear registros según el tipo de entidad
const createEntityRecord = async (record: any, tipoEntidad: TipoEntidad): Promise<boolean> => {
  try {
    switch (tipoEntidad) {
      case 'usuarios':
        await crearUsuario(record);
        return true;
      
      case 'reportes':
        await crearReporte(record);
        return true;
      
      case 'categorias':
        await createCategory(record);
        return true;
      
      case 'roles':
        await crearRol(record);
        return true;
      
      case 'estados':
        await createEstado(record);
        return true;
      
      default:
        throw new Error(`Tipo de entidad no soportado: ${tipoEntidad}`);
    }
  } catch (error) {
    console.error(`Error al crear registro de ${tipoEntidad}:`, error);
    throw error;
  }
};
