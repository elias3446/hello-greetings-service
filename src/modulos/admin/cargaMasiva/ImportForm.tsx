import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { TipoEntidad } from '@/types/tipos';
import { Upload, FileCheck, FileX } from 'lucide-react';
import { procesarArchivo } from './importUtils';
import PreviewTable from './PreviewTable';
import ImportResults from './ImportResults';

interface ImportFormProps {
  tipoEntidad: TipoEntidad;
}

type FileType = 'csv' | 'excel' | 'json';

const ImportForm: React.FC<ImportFormProps> = ({ tipoEntidad }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [errors, setErrors] = useState<any[] | null>(null);
  const [validationComplete, setValidationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: any[];
    failed: any[];
    total: number;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Reset states
    setFile(selectedFile);
    setPreviewData(null);
    setErrors(null);
    setValidationComplete(false);
    setImportResults(null);
    
    // Determine file type
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (extension === 'csv') {
      setFileType('csv');
    } else if (extension === 'xlsx' || extension === 'xls') {
      setFileType('excel');
    } else if (extension === 'json') {
      setFileType('json');
    } else {
      toast.error('Tipo de archivo no soportado. Por favor, sube un archivo CSV, Excel o JSON.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleValidate = async () => {
    if (!file || !fileType) return;
    
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Simulamos un progreso de validación
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);
      
      // Procesar el archivo para previsualización
      const { data, validationErrors } = await procesarArchivo(file, fileType, tipoEntidad, true);
      
      clearInterval(progressInterval);
      setProgress(100);
      setPreviewData(data);
      setErrors(validationErrors.length > 0 ? validationErrors : null);
      setValidationComplete(true);
      
      // Mostrar mensaje según resultado de validación
      if (validationErrors.length > 0) {
        toast.warning(`Se encontraron ${validationErrors.length} errores en los datos. Revise la previsualización.`);
      } else {
        toast.success('Validación completada sin errores.');
      }
    } catch (error) {
      console.error('Error al validar el archivo:', error);
      toast.error('Error al procesar el archivo. Por favor, verifica su formato.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleImport = async () => {
    if (!file || !fileType || !validationComplete) return;
    
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Simulamos un progreso de importación
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 200);
      
      // Procesar el archivo para importación
      const { successRecords, failedRecords, totalRecords } = await procesarArchivo(
        file, 
        fileType, 
        tipoEntidad, 
        false
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setImportResults({
        success: successRecords,
        failed: failedRecords,
        total: totalRecords
      });
      
      // Mostrar mensaje según resultado de importación
      if (failedRecords.length === 0) {
        toast.success(`Se importaron ${successRecords.length} registros correctamente.`);
      } else {
        toast.warning(
          `Importación parcial: ${successRecords.length} registros importados, ${failedRecords.length} con errores.`
        );
      }
    } catch (error) {
      console.error('Error al importar:', error);
      toast.error('Error durante la importación. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileType(null);
    setPreviewData(null);
    setErrors(null);
    setValidationComplete(false);
    setImportResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getTemplateUrl = () => {
    // En un entorno real, estas URLs apuntarían a archivos de plantilla reales
    switch (tipoEntidad) {
      case 'usuarios':
        return '/templates/usuarios_template.csv';
      case 'reportes':
        return '/templates/reportes_template.csv';
      case 'categorias':
        return '/templates/categorias_template.csv';
      case 'roles':
        return '/templates/roles_template.csv';
      case 'estados':
        return '/templates/estados_template.csv';
      default:
        return '#';
    }
  };

  return (
    <div className="space-y-6">
      {!importResults ? (
        <>
          <div className="p-6 border rounded-lg bg-muted/30">
            <h3 className="font-medium text-lg mb-4">
              Subir archivo de {tipoEntidad}
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Formatos soportados: CSV, Excel (.xlsx, .xls) y JSON.
                </p>
                <a 
                  href={getTemplateUrl()} 
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descargar plantilla de ejemplo
                </a>
              </div>
              
              <div className="flex items-center gap-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileChange}
                  className="max-w-md"
                  disabled={isLoading}
                />
                
                <Button 
                  onClick={handleValidate} 
                  disabled={!file || isLoading}
                  variant="outline"
                >
                  {isLoading ? 'Procesando...' : 'Validar'}
                </Button>
              </div>
              
              {isLoading && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {progress < 100 ? 'Procesando archivo...' : 'Procesamiento completado'}
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </div>
          </div>
          
          {file && fileType && (
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                {fileType === 'csv' && <FileCheck className="h-5 w-5 text-green-500" />}
                {fileType === 'excel' && <FileCheck className="h-5 w-5 text-green-500" />}
                {fileType === 'json' && <FileCheck className="h-5 w-5 text-green-500" />}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB • {file.type || 'Tipo desconocido'}
                  </p>
                </div>
              </div>
            </Card>
          )}
          
          {validationComplete && previewData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">
                  Previsualización ({previewData.length} registros)
                </h3>
                <div className="space-x-2">
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleImport}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Importando...' : 'Confirmar Importación'}
                  </Button>
                </div>
              </div>
              
              {errors && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle className="flex items-center">
                    <FileX className="h-4 w-4 mr-2" />
                    Se encontraron errores en los datos
                  </AlertTitle>
                  <AlertDescription>
                    Se han detectado {errors.length} errores en los datos. Los registros con errores no serán importados.
                    Puede continuar con la importación para cargar solo los registros válidos.
                  </AlertDescription>
                </Alert>
              )}
              
              <PreviewTable 
                data={previewData} 
                errors={errors || []} 
                tipoEntidad={tipoEntidad}
              />
            </div>
          )}
        </>
      ) : (
        <ImportResults 
          results={importResults}
          tipoEntidad={tipoEntidad}
          onReset={resetForm}
        />
      )}
    </div>
  );
};

export default ImportForm;
