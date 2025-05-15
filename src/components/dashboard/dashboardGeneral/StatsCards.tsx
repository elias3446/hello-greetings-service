import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCardsProps } from '@/props/dashboard/PropDashboardGeneral';


const StatsCards = ({ cards }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-md font-medium">{card.title}</CardTitle>
            <div 
              className="p-2 rounded-full" 
              style={{ backgroundColor: card.bgColor }}
            >
              <card.icon className="h-5 w-5" style={{ color: card.color }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards; 