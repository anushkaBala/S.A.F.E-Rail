
'use client';

import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Check, X, Undo } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type Alert = {
  id: string;
  location: string;
  timestamp: string;
  confidence: number;
  imageUrl: string;
  childName: string;
  aiHint: string;
  age: number;
  gender: 'Male' | 'Female' | 'Unknown';
  wearsSpectacles: boolean;
  isAlone: boolean;
  activity: string;
  status: 'new' | 'acknowledged';
};

type AlertListProps = {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  onViewDetails: (alert: Alert) => void;
};

export function AlertList({ alerts, onAcknowledge, onDismiss, onViewDetails }: AlertListProps) {
  const { toast } = useToast();

  const handleDismissClick = (id: string) => {
    onDismiss(id);
    toast({ title: 'Alert dismissed' });
  };
  
  const handleAcknowledgeClick = (id: string, currentStatus: 'new' | 'acknowledged') => {
    onAcknowledge(id);
    toast({ title: currentStatus === 'new' ? 'Alert Acknowledged' : 'Alert Marked as New' });
  };


  if (alerts.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No alerts to display.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className={cn(
            "flex items-center p-3 transition-colors rounded-lg border-l-4",
            alert.status === 'new' ? 'bg-card hover:bg-accent/50 border-destructive' : 'bg-muted/30 hover:bg-muted/60 border-transparent'
          )}
        >
          <Avatar className="w-12 h-12 rounded-md">
            <AvatarImage src={alert.imageUrl} alt={`Alert ${alert.id}`} data-ai-hint={alert.aiHint} />
            <AvatarFallback>{alert.childName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 ml-4">
            <p className="font-semibold">{alert.childName}</p>
            <p className="text-sm text-muted-foreground">
              {alert.location} &middot; {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="secondary">~{alert.age} yrs</Badge>
                <Badge variant="secondary">{alert.gender}</Badge>
                {alert.wearsSpectacles && <Badge variant="secondary">Spectacles</Badge>}
            </div>
          </div>
          <Badge variant={alert.confidence > 0.9 ? 'default' : 'secondary'} className="hidden mx-4 sm:inline-flex" style={{backgroundColor: alert.confidence > 0.9 ? "hsl(var(--primary))" : "hsl(var(--secondary))"}}>
            {Math.round(alert.confidence * 100)}%
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 ml-2">
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">Alert options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(alert)}>
                <Eye className="mr-2"/> View Details
              </DropdownMenuItem>

              {alert.status === 'new' ? (
                <DropdownMenuItem onClick={() => handleAcknowledgeClick(alert.id, alert.status)}>
                  <Check className="mr-2"/> Acknowledge
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleAcknowledgeClick(alert.id, alert.status)}>
                  <Undo className="mr-2"/> Mark as New
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDismissClick(alert.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <X className="mr-2"/> Dismiss
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}

    