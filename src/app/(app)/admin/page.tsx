import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
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
            <Input id="confidence-threshold" type="number" placeholder="e.g., 85" defaultValue="85" />
            <p className="text-sm text-muted-foreground">
              Set the minimum confidence score (%) to trigger an alert.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-email">Alert Notification Email</Label>
            <Input id="alert-email" type="email" placeholder="e.g., security@railcorp.com" defaultValue="security@railcorp.com" />
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
            <Switch id="realtime-analysis" defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-accent hover:bg-accent/90">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
