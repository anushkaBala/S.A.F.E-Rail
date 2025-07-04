
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertList, type Alert } from '@/components/alert-list';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, PersonStanding, GitFork, Glasses, ActivityIcon } from 'lucide-react';
import { generatePersonImage, type GeneratePersonImageInput } from '@/ai/flows/generate-person-image';
import { Skeleton } from '@/components/ui/skeleton';

const initialAlerts: Alert[] = [
  { id: '1', location: 'Platform 5', timestamp: '2024-07-29 14:35:10', confidence: 0.92, imageUrl: 'https://placehold.co/300x200.png', childName: 'Shruti Rao', aiHint: 'Indian girl', age: 7, gender: 'Female', wearsSpectacles: false, isAlone: true, activity: 'Waiting on platform', status: 'new' },
  { id: '2', location: 'Main Concourse', timestamp: '2024-07-29 14:32:54', confidence: 0.88, imageUrl: 'https://placehold.co/300x200.png', childName: 'Rohan Kumar', aiHint: 'Indian boy', age: 5, gender: 'Male', wearsSpectacles: true, isAlone: true, activity: 'Walking on station', status: 'new' },
  { id: '3', location: 'Entrance Hall', timestamp: '2024-07-29 14:28:12', confidence: 0.95, imageUrl: 'https://placehold.co/300x200.png', childName: 'Priya Sharma', aiHint: 'smiling girl', age: 12, gender: 'Female', wearsSpectacles: true, isAlone: false, activity: 'With an adult', status: 'acknowledged' },
  { id: '4', location: 'Ticket Office', timestamp: '2024-07-29 14:25:01', confidence: 0.78, imageUrl: 'https://placehold.co/300x200.png', childName: 'Aryan Singh', aiHint: 'crying boy', age: 4, gender: 'Male', wearsSpectacles: false, isAlone: true, activity: 'Near the ticket barrier', status: 'new' },
  { id: '5', location: 'Platform 2', timestamp: '2024-07-29 14:22:33', confidence: 0.99, imageUrl: 'https://placehold.co/300x200.png', childName: 'Abhi Verma', aiHint: 'boy backpack', age: 9, gender: 'Male', wearsSpectacles: false, isAlone: false, activity: 'Boarding a train', status: 'acknowledged' },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    async function loadAlertImages() {
        setAlerts(prev => prev.map(a => ({ ...a, imageLoading: true })));

        const imagePromises = initialAlerts.map(alert => {
            if (alert.gender === 'Unknown') {
                return Promise.resolve({ imageDataUri: 'https://placehold.co/300x200.png' });
            }
            const input: GeneratePersonImageInput = {
                age: alert.age,
                gender: alert.gender,
                wearsSpectacles: alert.wearsSpectacles
            };
            return generatePersonImage(input);
        });

        const results = await Promise.allSettled(imagePromises);

        const updatedAlerts = initialAlerts.map((alert, index) => {
            const result = results[index];
            if (result.status === 'fulfilled' && result.value.imageDataUri) {
                return { ...alert, imageUrl: result.value.imageDataUri, imageLoading: false };
            } else {
                console.error(`Failed to generate image for alert ${alert.id}:`, result.status === 'rejected' ? result.reason : 'No URI');
                return { ...alert, imageUrl: 'https://placehold.co/300x200.png', imageLoading: false };
            }
        });
        setAlerts(updatedAlerts);
    }
    loadAlertImages();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const searchMatch = alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.childName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const genderMatch = genderFilter === 'all' || alert.gender.toLowerCase() === genderFilter;

      let ageMatch = true;
      if (ageFilter !== 'all') {
        const [minAge, maxAge] = ageFilter.split('-').map(Number);
        ageMatch = alert.age >= minAge && alert.age <= maxAge;
      }
      
      return searchMatch && genderMatch && ageMatch;
    });
  }, [alerts, searchTerm, ageFilter, genderFilter]);

  const newAlerts = filteredAlerts.filter(alert => alert.status === 'new');
  const acknowledgedAlerts = filteredAlerts.filter(alert => alert.status === 'acknowledged');

  const handleAcknowledge = (id: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === id
          ? { ...alert, status: alert.status === 'new' ? 'acknowledged' : 'new' }
          : alert
      )
    );
  };
  
  const handleDismiss = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };
  
  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
  };


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
            <Input
              placeholder="Search by location or name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={setAgeFilter} value={ageFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="0-5">0-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="11-15">11-15 years</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setGenderFilter} value={genderFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
                <h3 className="mb-4 text-xl font-semibold tracking-tight">New Alerts ({newAlerts.length})</h3>
                <AlertList alerts={newAlerts} onAcknowledge={handleAcknowledge} onDismiss={handleDismiss} onViewDetails={handleViewDetails} />
            </div>
            <div>
                <h3 className="mb-4 text-xl font-semibold tracking-tight">Acknowledged Alerts ({acknowledgedAlerts.length})</h3>
                <AlertList alerts={acknowledgedAlerts} onAcknowledge={handleAcknowledge} onDismiss={handleDismiss} onViewDetails={handleViewDetails} />
            </div>
        </div>

        {selectedAlert && (
            <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Alert Details: {selectedAlert.childName}</DialogTitle>
                        <DialogDescription>
                            Detailed information for alert ID {selectedAlert.id}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            {selectedAlert.imageLoading ? (
                                <Skeleton className="w-full rounded-lg aspect-[4/3]" />
                            ) : (
                                <Image src={selectedAlert.imageUrl} alt={`Snapshot for alert ${selectedAlert.id}`} width={400} height={300} className="object-cover w-full rounded-lg" data-ai-hint={selectedAlert.aiHint} unoptimized />
                            )}
                            <div className="flex items-center justify-between">
                                <Badge variant={selectedAlert.confidence > 0.9 ? 'default' : 'secondary'} className="text-base" style={{backgroundColor: selectedAlert.confidence > 0.9 ? "hsl(var(--primary))" : "hsl(var(--secondary))"}}>
                                    {Math.round(selectedAlert.confidence * 100)}% Match Confidence
                                </Badge>
                                <Badge variant={selectedAlert.status === 'new' ? 'destructive' : 'default'} className="capitalize">
                                    Status: {selectedAlert.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                <div><strong>Location:</strong> {selectedAlert.location}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground" />
                                <div><strong>Timestamp:</strong> {new Date(selectedAlert.timestamp).toLocaleString()}</div>
                            </div>
                             <div className="flex items-center gap-3">
                                <ActivityIcon className="w-5 h-5 text-muted-foreground" />
                                <div><strong>Observed Activity:</strong> {selectedAlert.activity}</div>
                            </div>
                            <div className="p-4 border rounded-lg bg-muted/50">
                                <h4 className="mb-2 font-semibold">Child Details</h4>
                                <div className="grid grid-cols-2 gap-2">
                                     <div className="flex items-center gap-2">
                                        <PersonStanding className="w-4 h-4 text-muted-foreground" />
                                        <span><strong>Gender:</strong> {selectedAlert.gender}</span>
                                    </div>
                                    <div><strong>Age:</strong> ~{selectedAlert.age} years</div>
                                    <div className="flex items-center gap-2">
                                        <Glasses className="w-4 h-4 text-muted-foreground" />
                                        <span><strong>Spectacles:</strong> {selectedAlert.wearsSpectacles ? 'Yes' : 'No'}</span>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <GitFork className="w-4 h-4 text-muted-foreground" />
                                        <span><strong>Alone:</strong> {selectedAlert.isAlone ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedAlert(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
