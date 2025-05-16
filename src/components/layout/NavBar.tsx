import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, LayoutDashboard, Map, FileText, Settings,
  HelpCircle, PlusCircle, Bell, Sun, Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { to: '/dashboard', label: 'Panel', icon: LayoutDashboard },
    { to: '/mapa', label: 'Mapa', icon: Map },
    { to: '/reportes', label: 'Reportes', icon: FileText },
    { to: '/admin', label: 'Admin', icon: Settings },
    { to: '/help', label: 'Ayuda', icon: HelpCircle },
  ];

  const renderNavLink = ({ to, label, icon: Icon }: typeof navLinks[number], isMobile = false) => (
    <Link
      key={to}
      to={to}
      className={`nav-link ${isMobile ? 'w-full py-2.5 flex items-center' : 'px-1.5 py-1 whitespace-nowrap text-sm lg:text-base'}`}
      onClick={() => isMobile && setIsOpen(false)}
    >
      <Icon className={isMobile ? 'h-5 w-5' : 'h-4 w-4 inline-block'} />
      <span className={isMobile ? 'ml-2' : 'ml-1'}>{label}</span>
    </Link>
  );

  return (
    <nav className="bg-background sticky top-0 z-[100] w-full min-w-[320px] border-b shadow-sm">
      <div className="w-full px-1 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-base sm:text-xl font-display text-primary hover:text-primary/90 transition-colors">
            <Globe className="h-4 w-4 sm:h-6 sm:w-6" />
            <span>GeoReport</span>
          </Link>

          {/* Navegación en escritorio */}
          <div className="hidden [@media(min-width:909px)]:flex flex-1 justify-center mx-2 space-x-1 lg:space-x-2">
            {navLinks.map(link => renderNavLink(link))}
          </div>

          {/* Botones lado derecho */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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
              <span className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 text-xs font-bold text-primary-foreground bg-primary rounded-full animate-in flex items-center justify-center">
                3
              </span>
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Cambiar tema"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Avatar className="h-7 w-7 sm:h-9 sm:w-9 hover:opacity-80 transition-opacity">
              <AvatarImage
                src="/lovable-uploads/687768f1-c3e3-4ac2-a06c-e841cb59dd1e.png"
                alt="User avatar"
              />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>

            {/* Botón de menú móvil */}
            <Button
              variant="ghost"
              size="sm"
              className="[@media(min-width:909px)]:hidden p-1"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Abrir menú"
            >
              {isOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`[@media(min-width:909px)]:hidden fixed left-0 right-0 top-14 sm:top-16 z-50 bg-background shadow-md border-y border-border transition-all duration-200 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-3 py-2 space-y-1">
          {navLinks.map(link => renderNavLink(link, true))}
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