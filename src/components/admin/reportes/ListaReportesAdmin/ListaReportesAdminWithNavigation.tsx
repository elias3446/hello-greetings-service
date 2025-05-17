import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListaReportesAdmin from '@/modulos/admin/reportes/ListaReportesAdmin';

const ListaReportesAdminWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <ListaReportesAdmin navigate={navigate} />;
};

export default ListaReportesAdminWithNavigation; 