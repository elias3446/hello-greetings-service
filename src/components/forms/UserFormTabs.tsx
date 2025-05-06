import React from 'react';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { TabContentProps } from '@/types/user';
import { FormFieldGrid, FormInput, FormMultiSelect, FormSelect } from './UserFormFields';
import { USER_STATUS_OPTIONS } from '@/utils/userConstants';
import { roles } from '@/data/roles';

export const GeneralInfoTab = ({ form }: TabContentProps) => (
  <Form {...form}>
    <form className="space-y-6">
      <FormFieldGrid>
        <FormInput
          control={form.control}
          name="nombre"
          label="Nombre"
          placeholder="Nombre del usuario"
        />
        <FormInput
          control={form.control}
          name="apellido"
          label="Apellido"
          placeholder="Apellido del usuario"
        />
      </FormFieldGrid>

      <FormInput
        control={form.control}
        name="email"
        label="Correo electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
      />

      <Separator className="my-4" />
      
      <FormField
        control={form.control}
        name="tipo"
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormLabel>Tipo de Usuario</FormLabel>
            <FormControl>
              <div className="flex gap-4" role="radiogroup" aria-invalid={error ? 'true' : 'false'}>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="usuario" 
                    value="usuario"
                    checked={field.value === "usuario"}
                    onChange={() => field.onChange("usuario")}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="usuario" className="text-sm text-gray-700">Usuario</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="admin" 
                    value="admin"
                    checked={field.value === "admin"}
                    onChange={() => field.onChange("admin")}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="admin" className="text-sm text-gray-700">Administrativo</label>
                </div>
              </div>
            </FormControl>
            {error && (
              <p className="text-sm text-red-500" id="tipo-error">
                {error.message}
              </p>
            )}
          </FormItem>
        )}
      />
    </form>
  </Form>
);

export const AccountInfoTab = ({ form, modo }: TabContentProps) => (
  <Form {...form}>
    <form className="space-y-6">
      <FormInput
        control={form.control}
        name="password"
        label="Contraseña"
        type="password"
        placeholder={modo === 'editar' ? '••••••••' : 'Contraseña'}
        description={modo === 'editar' ? 'Deje en blanco para mantener la contraseña actual' : 'Mínimo 8 caracteres con letras y números'}
      />

      <FormMultiSelect
        control={form.control}
        name="roles"
        label="Rol"
        options={roles.map(rol => ({ value: rol.id, label: rol.nombre }))}
      />

      <FormSelect
        control={form.control}
        name="estado"
        label="Estado"
        options={USER_STATUS_OPTIONS}
      />
    </form>
  </Form>
); 