import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TipoEntidad } from '@/types/tipos';
import { getFieldsForEntityType } from './importUtils';

interface PreviewTableProps {
  data: any[];
  errors: any[];
  tipoEntidad: TipoEntidad;
}

const PreviewTable: React.FC<PreviewTableProps> = ({ data, errors, tipoEntidad }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!data || data.length === 0) {
    return (
      <Alert>
        <AlertDescription>No hay datos para mostrar.</AlertDescription>
      </Alert>
    );
  }

  const fields = getFieldsForEntityType(tipoEntidad);
  
  // Filtrar registros por término de búsqueda
  const filteredData = searchTerm ? data.filter(record => {
    return fields.some(field => {
      const value = record[field.key];
      return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }) : data;
  
  // Verificar si un registro tiene errores
  const hasErrors = (record: any) => {
    return errors.some(error => error.row === record.__rowIndex);
  };
  
  // Obtener errores para un registro específico
  const getErrorsForRecord = (record: any) => {
    return errors.filter(error => error.row === record.__rowIndex);
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <Input
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Estado</TableHead>
              {fields.map(field => (
                <TableHead key={field.key}>{field.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((record, index) => {
              const recordHasErrors = hasErrors(record);
              
              return (
                <React.Fragment key={index}>
                  <TableRow className={recordHasErrors ? 'bg-red-50' : ''}>
                    <TableCell>
                      {recordHasErrors ? (
                        <Badge variant="destructive">Error</Badge>
                      ) : (
                        <Badge variant="secondary">Válido</Badge>
                      )}
                    </TableCell>
                    {fields.map(field => (
                      <TableCell key={field.key} className="max-w-xs truncate">
                        {record[field.key] !== undefined && record[field.key] !== null 
                          ? String(record[field.key])
                          : <span className="text-muted-foreground italic">Vacío</span>
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                  {recordHasErrors && (
                    <TableRow className="bg-red-50">
                      <TableCell colSpan={fields.length + 1} className="p-0 border-t-0">
                        <div className="px-4 py-2">
                          <div className="text-sm font-medium text-red-800 mb-1">Errores detectados:</div>
                          <ul className="list-disc list-inside text-sm text-red-600 pl-2">
                            {getErrorsForRecord(record).map((error, errIdx) => (
                              <li key={errIdx}>{error.message}</li>
                            ))}
                          </ul>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={fields.length + 1} className="h-24 text-center">
                  No se encontraron registros que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};

export default PreviewTable;
