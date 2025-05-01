
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center space-y-6 animate-in">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-20 w-20 text-amber-500" />
        </div>
        
        <h1 className="text-5xl font-bold text-gray-800 font-display">404</h1>
        <div className="h-1 w-20 bg-primary mx-auto my-4 rounded-full"></div>
        
        <div className="space-y-4">
          <p className="text-xl text-gray-600">
            Lo sentimos, la página que estás buscando no existe.
          </p>
          <p className="text-muted-foreground">
            El enlace podría estar roto o la página puede haber sido eliminada.
          </p>
        </div>
        
        <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default" className="px-6">
            <Link to="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline" className="px-6">
            <Link to="/reportes">Ver reportes</Link>
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 pt-4">
          Si cree que esto es un error, por favor contacte al administrador.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
