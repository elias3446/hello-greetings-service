
import React from 'react';
import NavBar from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
  titulo?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, titulo }) => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container py-6 animate-in relative z-[5]">
        {titulo && (
          <div className="pb-6 mb-6 border-b">
            <h1 className="text-foreground">{titulo}</h1>
          </div>
        )}
        <div className="space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
