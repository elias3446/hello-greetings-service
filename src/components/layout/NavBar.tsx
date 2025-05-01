
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, LayoutDashboard, Map, FileText, Settings, HelpCircle, PlusCircle, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const NavBar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-[100] w-full border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center gap-2 text-xl font-display text-primary hover:text-primary/90 transition-colors">
              <Globe className="h-6 w-6" />
              <span>GeoReport</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard className="h-4 w-4" />
                Panel
              </Link>
              <Link to="/mapa" className="nav-link">
                <Map className="h-4 w-4" />
                Mapa
              </Link>
              <Link to="/reportes" className="nav-link">
                <FileText className="h-4 w-4" />
                Reportes
              </Link>
              <Link to="/admin" className="nav-link">
                <Settings className="h-4 w-4" />
                Administración
              </Link>
              <Link to="/help" className="nav-link">
                <HelpCircle className="h-4 w-4" />
                Ayuda
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex animate-in"
              asChild
            >
              <Link to="/reportes/nuevo">
                <PlusCircle className="h-4 w-4" />
                Nuevo Reporte
              </Link>
            </Button>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-primary-foreground bg-primary rounded-full animate-in">3</span>
            </button>
            <Avatar className="hover:opacity-80 transition-opacity">
              <AvatarImage
                src="/lovable-uploads/687768f1-c3e3-4ac2-a06c-e841cb59dd1e.png"
                alt="User avatar"
              />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="sm:hidden animate-in">
        {isOpen && (
          <div className="px-2 pb-3 pt-2 space-y-1">
            <Link
              to="/dashboard"
              className="nav-link w-full py-3"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              Panel
            </Link>
            <Link
              to="/mapa"
              className="nav-link w-full py-3"
              onClick={() => setIsOpen(false)}
            >
              <Map className="h-5 w-5" />
              Mapa
            </Link>
            <Link
              to="/reportes"
              className="nav-link w-full py-3"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="h-5 w-5" />
              Reportes
            </Link>
            <Link
              to="/admin"
              className="nav-link w-full py-3"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-5 w-5" />
              Administración
            </Link>
            <Link
              to="/help"
              className="nav-link w-full py-3"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="h-5 w-5" />
              Ayuda
            </Link>
            <Link
              to="/reportes/nuevo"
              className="btn btn-primary w-full py-3 mt-4"
              onClick={() => setIsOpen(false)}
            >
              <PlusCircle className="h-5 w-5" />
              Nuevo Reporte
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
