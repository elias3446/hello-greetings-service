import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormFieldProps, FormSelectProps, FormMultiSelectProps } from '@/types/user';

export const FormFieldWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-6">
    {children}
  </div>
);

export const FormFieldGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {children}
  </div>
);

export const FormInput = ({ control, name, label, placeholder, type = 'text', description }: FormFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input 
            type={type} 
            placeholder={placeholder} 
            {...field} 
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        {error && (
          <p className="text-sm text-red-500" id={`${name}-error`}>
            {error.message}
          </p>
        )}
      </FormItem>
    )}
  />
);

export const FormSelect = ({ control, name, label, options }: FormSelectProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select 
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger aria-invalid={error ? 'true' : 'false'}>
              <SelectValue placeholder={`Selecciona ${label.toLowerCase()}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-red-500" id={`${name}-error`}>
            {error.message}
          </p>
        )}
      </FormItem>
    )}
  />
);

export const FormMultiSelect = ({ control, name, label, options }: FormMultiSelectProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select 
          onValueChange={(value) => field.onChange([value])}
          defaultValue={field.value?.[0]}
        >
          <FormControl>
            <SelectTrigger aria-invalid={error ? 'true' : 'false'}>
              <SelectValue placeholder={`Selecciona ${label.toLowerCase()}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-red-500" id={`${name}-error`}>
            {error.message}
          </p>
        )}
      </FormItem>
    )}
  />
); 