import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DetalleReporteBreadcrumb: React.FC = () => (
  <div className="flex items-center justify-between">
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground flex items-center">
        <Link to="/admin/reportes" className="hover:underline flex items-center">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Reportes
        </Link>
        <span className="mx-2">/</span>
        <span>Detalle</span>
      </div>
    </div>
  </div>
);

export default DetalleReporteBreadcrumb; 