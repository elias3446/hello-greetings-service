import { SortOption, FilterOption } from '@/types/user';

export const ITEMS_PER_PAGE = 10;

export const SORT_OPTIONS: SortOption[] = [
  { value: 'nombre', label: 'Nombre' },
  { value: 'email', label: 'Email' },
  { value: 'fecha', label: 'Fecha creación' },
];

export const FILTER_OPTIONS: FilterOption[] = [
  { value: 'estado', label: 'Estado' },
  { value: 'rol', label: 'Rol' },
]; 