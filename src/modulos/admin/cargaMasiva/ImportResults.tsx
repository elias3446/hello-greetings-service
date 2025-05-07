import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { TipoEntidad } from '@/types/tipos';
import { getFieldsForEntityType } from './importUtils';
import { CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';

interface ImportResultsProps {
  results: {
    success: any[];
    failed: any[];
    total: number;
  };
  tipoEntidad: TipoEntidad;
  onReset: () => void;
}

const ImportResults: React.FC<ImportResultsProps> = ({ results, tipoEntidad, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'success' | 'failed'>(
    results.success.length > 0 ? 'success' : 'failed'
  );

  const fields = getFieldsForEntityType(tipoEntidad);
  
  const filterData = (data: any[]) => {
    if (!searchTerm) return data;
    
    return data.filter(record => {
      return fields.some(field => {
        const value = record[field.key];
        return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  };
  
  const successData = filterData(results.success);
  const failedData = filterData(results.failed);

  return (
    <div className="space-y-6">
      <Card className="bg-muted/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Resultados de la importación</h2>
              <p className="text-muted-foreground">
                {results.total} registros procesados
              </p>
            </div>
            <Button onClick={onReset}>Importar más datos</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registros importados</p>
                  <p className="text-2xl font-bold">{results.success.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registros fallidos</p>
                  <p className="text-2xl font-bold">{results.failed.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasa de éxito</p>
                  <p className="text-2xl font-bold">
                    {results.total > 0 
                      ? `${Math.round((results.success.length / results.total) * 100)}%` 
                      : '0%'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Detalle de registros</h3>
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar registros..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'success' | 'failed')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="success" 
              disabled={results.success.length === 0}
            >
              Registros exitosos ({results.success.length})
            </TabsTrigger>
            <TabsTrigger 
              value="failed"
              disabled={results.failed.length === 0}
            >
              Registros fallidos ({results.failed.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="success">
            <Card>
              <ScrollArea className="h-[400px]">
                {successData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {fields.map(field => (
                          <TableHead key={field.key}>{field.label}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {successData.map((record, index) => (
                        <TableRow key={index}>
                          {fields.map(field => (
                            <TableCell key={field.key}>
                              {record[field.key] !== undefined && record[field.key] !== null 
                                ? String(record[field.key])
                                : <span className="text-muted-foreground italic">Vacío</span>
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">No hay registros exitosos que coincidan con la búsqueda.</p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>
          
          <TabsContent value="failed">
            <Card>
              <ScrollArea className="h-[400px]">
                {failedData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Error</TableHead>
                        {fields.map(field => (
                          <TableHead key={field.key}>{field.label}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {failedData.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="max-w-xs">
                            <div className="text-red-500 text-sm whitespace-normal">
                              {record.error || "Error desconocido"}
                            </div>
                          </TableCell>
                          {fields.map(field => (
                            <TableCell key={field.key}>
                              {record[field.key] !== undefined && record[field.key] !== null 
                                ? String(record[field.key])
                                : <span className="text-muted-foreground italic">Vacío</span>
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">No hay registros fallidos que coincidan con la búsqueda.</p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImportResults;
