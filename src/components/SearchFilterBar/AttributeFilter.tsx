
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttributeFilterProps } from "./types";

export function AttributeFilter({
  attributes,
  selectedAttribute,
  onChange,
}: AttributeFilterProps) {
  return (
    <Select value={selectedAttribute} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccionar atributo" />
      </SelectTrigger>
      <SelectContent>
        {attributes.map(attr => (
          <SelectItem key={attr.value} value={attr.value}>
            {attr.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}