import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, LayoutDashboard, Map, FileText, Settings, HelpCircle, PlusCircle, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const NavBar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-background sticky top-0 z-[100] w-full min-w-[320px] border-b shadow-sm">
      <div className="w-full px-1 sm:px-4 lg:px-6">
        <div className="flex flex-nowrap items-center justify-between h-14 sm:h-16">
          {/* Logo - Always visible */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center gap-1 sm:gap-2 text-base sm:text-xl font-display text-primary hover:text-primary/90 transition-colors">
              <Globe className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>GeoReport</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden [@media(min-width:909px)]:flex items-center justify-center flex-1 mx-2">
            <div className="flex items-center space-x-0.5 lg:space-x-2">
              <Link to="/dashboard" className="nav-link px-1.5 py-1 whitespace-nowrap text-sm lg:text-base">
                <LayoutDashboard className="h-4 w-4 inline-block" />
                <span className="ml-1">Panel</span>
              </Link>
              <Link to="/mapa" className="nav-link px-1.5 py-1 whitespace-nowrap text-sm lg:text-base">
                <Map className="h-4 w-4 inline-block" />
                <span className="ml-1">Mapa</span>
              </Link>
              <Link to="/reportes" className="nav-link px-1.5 py-1 whitespace-nowrap text-sm lg:text-base">
                <FileText className="h-4 w-4 inline-block" />
                <span className="ml-1">Reportes</span>
              </Link>
              <Link to="/admin" className="nav-link px-1.5 py-1 whitespace-nowrap text-sm lg:text-base">
                <Settings className="h-4 w-4 inline-block" />
                <span className="ml-1">Admin</span>
              </Link>
              <Link to="/help" className="nav-link px-1.5 py-1 whitespace-nowrap text-sm lg:text-base">
                <HelpCircle className="h-4 w-4 inline-block" />
                <span className="ml-1">Ayuda</span>
              </Link>
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
            <Button
              variant="default"
              size="sm"
              className="hidden [@media(min-width:909px)]:inline-flex animate-in px-2"
              asChild
            >
              <Link to="/reportes/nuevo">
                <PlusCircle className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Nuevo Reporte</span>
                <span className="lg:hidden">Nuevo</span>
              </Link>
            </Button>
            <button className="relative p-1 sm:p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 text-xs font-bold text-primary-foreground bg-primary rounded-full animate-in">3</span>
            </button>
            <Avatar className="h-7 w-7 sm:h-9 sm:w-9 hover:opacity-80 transition-opacity">
              <AvatarImage
                src="/lovable-uploads/687768f1-c3e3-4ac2-a06c-e841cb59dd1e.png"
                alt="User avatar"
              />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              className="[@media(min-width:909px)]:hidden p-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`[@media(min-width:909px)]:hidden fixed left-0 right-0 top-14 sm:top-16 z-50 bg-background shadow-md border-b border-t border-border transition-all duration-200 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-3 py-2 space-y-1">
          <Link
            to="/dashboard"
            className="nav-link w-full py-2.5 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="ml-2">Panel</span>
          </Link>
          <Link
            to="/mapa"
            className="nav-link w-full py-2.5 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Map className="h-5 w-5" />
            <span className="ml-2">Mapa</span>
          </Link>
          <Link
            to="/reportes"
            className="nav-link w-full py-2.5 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span className="ml-2">Reportes</span>
          </Link>
          <Link
            to="/admin"
            className="nav-link w-full py-2.5 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-5 w-5" />
            <span className="ml-2">Administración</span>
          </Link>
          <Link
            to="/help"
            className="nav-link w-full py-2.5 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <HelpCircle className="h-5 w-5" />
            <span className="ml-2">Ayuda</span>
          </Link>
          <Link
            to="/reportes/nuevo"
            className="btn btn-primary w-full py-2.5 mt-2 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="ml-2">Nuevo Reporte</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
