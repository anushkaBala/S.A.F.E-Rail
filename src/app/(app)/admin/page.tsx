'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { toast } = useToast();
  const [confidence, setConfidence] = useState(85);
  const [email, setEmail] = useState('security@railcorp.com');
  const [realtimeAnalysis, setRealtimeAnalysis] = useState(true);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your new configurations have been applied.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>
            Manage user roles, permissions, and system configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
            <Input id="confidence-threshold" type="number" placeholder="e.g., 85" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} />
            <p className="text-sm text-muted-foreground">
              Set the minimum confidence score (%) to trigger an alert.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-email">Alert Notification Email</Label>
            <Input id="alert-email" type="email" placeholder="e.g., security@railcorp.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="text-sm text-muted-foreground">
              Email address to receive high-priority alerts.
            </p>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="realtime-analysis" className="font-medium">Enable Real-Time Analysis</Label>
              <p className="text-sm text-muted-foreground">
                Globally enable or disable CCTV analysis.
              </p>
            </div>
            <Switch id="realtime-analysis" checked={realtimeAnalysis} onCheckedChange={setRealtimeAnalysis} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-accent hover:bg-accent/90" onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
