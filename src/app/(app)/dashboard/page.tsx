import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BellRing, Users, CheckCircle } from 'lucide-react';
import { AlertList } from '@/components/alert-list';
import { DetectionChart } from '@/components/detection-chart';

export default function DashboardPage() {
  const stats = [
    { title: 'Active Alerts', value: '12', icon: BellRing, color: 'text-destructive' },
    { title: 'Children Found', value: '8', icon: Users, color: 'text-primary' },
    { title: 'System Status', value: 'Operational', icon: CheckCircle, color: 'text-green-500' },
  ];

  const alerts = [
    { id: '1', location: 'Platform 5', timestamp: '2024-07-29 14:35:10', confidence: 0.92, imageUrl: 'https://placehold.co/100x100.png', childName: 'Unidentified', aiHint: 'child face' },
    { id: '2', location: 'Main Concourse', timestamp: '2024-07-29 14:32:54', confidence: 0.88, imageUrl: 'https://placehold.co/100x100.png', childName: 'Unidentified', aiHint: 'child face' },
    { id: '3', location: 'Entrance Hall', timestamp: '2024-07-29 14:28:12', confidence: 0.95, imageUrl: 'https://placehold.co/100x100.png', childName: 'Jane Doe', aiHint: 'child face' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 text-muted-foreground ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Detections Over Time</CardTitle>
            <CardDescription>Recent unaccompanied child detections across the network.</CardDescription>
          </CardHeader>
          <CardContent>
            <DetectionChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Active high-priority alerts needing attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertList alerts={alerts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
