import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart4, MapPin, Users } from 'lucide-react';

const Features = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <BarChart4 className="h-6 w-6 text-blue-700" />
          </div>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Panel de estadísticas y visualizaciones de reportes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Visualización de datos en tiempo real sobre reportes, estados y categorías.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/dashboard">
              Ir al Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <MapPin className="h-6 w-6 text-green-700" />
          </div>
          <CardTitle>Mapa</CardTitle>
          <CardDescription>Visualización geográfica de reportes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Visualice todos los reportes en un mapa interactivo con filtraciones por categoría y estado.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/mapa">
              Ver Mapa
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-purple-700" />
          </div>
          <CardTitle>Administración</CardTitle>
          <CardDescription>Gestión de usuarios, roles y configuraciones</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Administre usuarios, roles, categorías y estados de reportes desde un solo lugar.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/admin">
              Acceder
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Features; 