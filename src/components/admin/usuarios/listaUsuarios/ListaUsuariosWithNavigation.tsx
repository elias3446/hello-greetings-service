import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListaUsuarios from '@/modulos/admin/usuarios/ListaUsuarios';

const ListaUsuariosWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <ListaUsuarios navigate={navigate} />;
};

export default ListaUsuariosWithNavigation; 