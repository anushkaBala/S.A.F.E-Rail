import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Alert = {
  id: string;
  location: string;
  timestamp: string;
  confidence: number;
  imageUrl: string;
  childName: string;
  aiHint: string;
};

type AlertListProps = {
  alerts: Alert[];
};

export function AlertList({ alerts }: AlertListProps) {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-center p-2 -m-2 transition-colors rounded-lg hover:bg-accent/50">
          <Avatar className="w-12 h-12 rounded-md">
            <AvatarImage src={alert.imageUrl} alt={`Alert ${alert.id}`} data-ai-hint={alert.aiHint} />
            <AvatarFallback>{alert.childName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <p className="font-semibold">{alert.childName}</p>
            <p className="text-sm text-muted-foreground">
              {alert.location} &middot; {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Badge variant={alert.confidence > 0.9 ? 'default' : 'secondary'} className="hidden sm:inline-flex" style={{backgroundColor: alert.confidence > 0.9 ? "hsl(var(--primary))" : "hsl(var(--secondary))"}}>
            {Math.round(alert.confidence * 100)}% Match
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 ml-2">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Acknowledge</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Dismiss</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
