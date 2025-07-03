
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertList, type Alert } from '@/components/alert-list';
import { DetectionChart } from '@/components/detection-chart';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrainFront, Users } from 'lucide-react';

const initialAlerts: Alert[] = [
  { id: '1', location: 'Platform 5', timestamp: '2024-07-29 14:35:10', confidence: 0.92, imageUrl: 'https://placehold.co/100x100.png', childName: 'Unidentified', aiHint: 'child face', age: 7, gender: 'Female', wearsSpectacles: false, isAlone: true, activity: 'Waiting on platform', status: 'new' },
  { id: '2', location: 'Main Concourse', timestamp: '2024-07-29 14:32:54', confidence: 0.88, imageUrl: 'https://placehold.co/100x100.png', childName: 'Unidentified', aiHint: 'child alone', age: 5, gender: 'Male', wearsSpectacles: true, isAlone: true, activity: 'Walking on station', status: 'new' },
  { id: '3', location: 'Entrance Hall', timestamp: '2024-07-29 14:28:12', confidence: 0.95, imageUrl: 'https://placehold.co/100x100.png', childName: 'Jane Doe', aiHint: 'girl smiling', age: 12, gender: 'Female', wearsSpectacles: true, isAlone: false, activity: 'With an adult', status: 'acknowledged' },
];

const trainData = [
    { name: 'Jan Shatabdi', platform: '3', departure: '15:10', status: 'On Time', variant: 'secondary' as const },
    { name: 'Rajdhani Express', platform: '1', departure: '15:25', status: 'On Time', variant: 'secondary' as const },
    { name: 'Damodar Express', platform: '7', departure: '15:40', status: 'Delayed', variant: 'destructive' as const },
    { name: 'Katihar Malgadi', platform: 'Goods', departure: '15:55', status: 'On Time', variant: 'secondary' as const },
    { name: 'Vande Bharat', platform: '2', departure: '16:05', status: 'Boarding', variant: 'default' as const },
    { name: 'Danapur Express', platform: '6', departure: '16:20', status: 'On Time', variant: 'secondary' as const },
    { name: 'CMT-Siliguri', platform: '4', departure: '16:45', status: 'Delayed', variant: 'destructive' as const },
    { name: 'Sanghamitra Exp', platform: '5', departure: '17:00', status: 'On Time', variant: 'secondary' as const },
];

const missingPersonsData = [
  { name: 'Khushi Sharma', gender: 'Female', age: 8, spectacles: 'No', parentName: 'Rakesh Sharma', parentPhone: '9876543210', state: 'Maharashtra', city: 'Mumbai' },
  { name: 'Soham Vari', gender: 'Male', age: 6, spectacles: 'Yes', parentName: 'Priya Vari', parentPhone: '8765432109', state: 'Delhi', city: 'New Delhi' },
  { name: 'Harbhajan Singh', gender: 'Male', age: 10, spectacles: 'No', parentName: 'Manjeet Singh', parentPhone: '9988776655', state: 'Punjab', city: 'Amritsar' },
  { name: 'Gudiya Devi', gender: 'Female', age: 7, spectacles: 'No', parentName: 'Ramesh Kumar', parentPhone: '8123456789', state: 'Bihar', city: 'Patna' },
  { name: 'Aarav Patel', gender: 'Male', age: 9, spectacles: 'No', parentName: 'Sunita Patel', parentPhone: '9123456780', state: 'Gujarat', city: 'Ahmedabad' },
];


export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts.filter(a => a.status === 'new'));
  const { toast } = useToast();
  
  const handleDismiss = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };
  
  const handleAcknowledge = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    toast({ title: "Alert Acknowledged", description: "The alert has been moved to the acknowledged list." });
  };
  
  const handleViewDetails = (alert: Alert) => {
    toast({ title: "Viewing Details", description: `Loading details for ${alert.childName}...` });
  };


  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Live Train Departures</CardTitle>
          <CardDescription>Real-time train schedule for the main station.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train</TableHead>
                <TableHead className="hidden sm:table-cell">Platform</TableHead>
                <TableHead className="hidden md:table-cell">Departure</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainData.map((train) => (
                <TableRow key={train.name}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">
                      <TrainFront className="w-4 h-4 text-muted-foreground" />
                      {train.name}
                    </div>
                    <div className="text-sm text-muted-foreground md:hidden">
                        Departs: {train.departure}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{train.platform}</TableCell>
                  <TableCell className="hidden md:table-cell">{train.departure}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={train.variant} className="capitalize">{train.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Missing Persons Report</span>
          </CardTitle>
          <CardDescription>
            Recently filed missing person reports for children.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child Details</TableHead>
                <TableHead className="hidden md:table-cell">Parent Details</TableHead>
                <TableHead className="hidden sm:table-cell">Location</TableHead>
                <TableHead className="text-right">Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missingPersonsData.map((person) => (
                <TableRow key={person.name}>
                  <TableCell>
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {person.gender} {person.spectacles === 'Yes' ? '• Spectacles' : ''}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                     <div>{person.parentName}</div>
                    <div className="text-sm text-muted-foreground">{person.parentPhone}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{person.city}, {person.state}</TableCell>
                  <TableCell className="text-right">{person.age}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
            <AlertList alerts={alerts} onAcknowledge={handleAcknowledge} onDismiss={handleDismiss} onViewDetails={handleViewDetails} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
