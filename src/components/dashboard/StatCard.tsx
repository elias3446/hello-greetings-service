
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const StatCard = ({ title, value, icon: Icon, color, bgColor }: StatCardProps) => {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        <div 
          className="p-2 rounded-full" 
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="h-5 w-5" style={{ color: color }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
