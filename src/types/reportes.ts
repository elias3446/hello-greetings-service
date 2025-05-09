import { Reporte } from '@/types/tipos';

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
}


export interface ReporteTableProps {
  reportes: Reporte[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (reporte: Reporte) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reporte: Reporte | null;
} 