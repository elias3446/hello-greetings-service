
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Predefined colors palette
const colorOptions = [
  '#FFD166', '#118AB2', '#06D6A0', '#073B4C', '#EF476F',
  '#8B5CF6', '#EC4899', '#F97316', '#EAB308', '#84CC16',
  '#10B981', '#0EA5E9', '#6366F1', '#D946EF', '#F43F5E'
];

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-10 h-10 rounded p-0 border"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-5 gap-2 p-2">
          {colorOptions.map((colorOption) => (
            <Button
              key={colorOption}
              style={{ backgroundColor: colorOption }}
              className="w-8 h-8 rounded-md p-0 cursor-pointer"
              onClick={() => onChange(colorOption)}
            />
          ))}
        </div>
        <div className="flex items-center mt-2 px-1">
          <div 
            className="w-8 h-8 rounded-md mr-2" 
            style={{ backgroundColor: color }}
          />
          <div className="text-sm font-medium">{color}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
