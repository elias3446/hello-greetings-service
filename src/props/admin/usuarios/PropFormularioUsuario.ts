import { UserFormData } from "@/types/user";
import { UseFormReturn } from "react-hook-form";

export interface FormularioUsuarioContentProps {
    form: UseFormReturn<any>;
    modo: 'crear' | 'editar';
  }

  export interface FormularioUsuarioHeaderProps {
    modo: 'crear' | 'editar';
    handleCancel: () => void;
    handleSubmit: (data: UserFormData) => Promise<void>;
    isSubmitting: boolean;
    form: UseFormReturn<any>;
  }