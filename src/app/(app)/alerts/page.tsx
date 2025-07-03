import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertList } from '@/components/alert-list';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function AlertsPage() {
    const alerts = [
    { id: '1', location: 'Platform 5', timestamp: '2024-07-29 14:35:10', confidence: 0.92, imageUrl: 'https://placehold.co/100x100.png', childName: 'Unidentified', aiHint: 'child face' },
    { id: '2', location: 'Main Concourse', timestamp: '2024-07-29 14:32:54', confidence: 0.88, imageUrl: 'https://placehold.co/100x100.png', childName: 'Unidentified', aiHint: 'child face' },
    { id: '3', location: 'Entrance Hall', timestamp: '2024-07-29 14:28:12', confidence: 0.95, imageUrl: 'https://placehold.co/100x100.png', childName: 'Jane Doe', aiHint: 'child face' },
    { id: '4', location: 'Ticket Office', timestamp: '2024-07-29 14:25:01', confidence: 0.78, imageUrl: 'https://placehold.co/100x100.png', childName: 'Unidentified', aiHint: 'child face' },
    { id: '5', location: 'Platform 2', timestamp: '2024-07-29 14:22:33', confidence: 0.99, imageUrl: 'https://placehold.co/100x100.png', childName: 'John Smith', aiHint: 'child face' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alerts</CardTitle>
        <CardDescription>
          Review and manage all system-generated alerts for unaccompanied children.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
            <Input placeholder="Search by location or name..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-5">0-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="11-15">11-15 years</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AlertList alerts={alerts} />
      </CardContent>
    </Card>
  );
}
