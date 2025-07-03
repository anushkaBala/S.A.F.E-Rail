import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

export default function CctvPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CCTV Analysis</CardTitle>
        <CardDescription>
          This module continuously analyzes live CCTV feeds to detect unaccompanied children in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg h-96 border-border bg-card">
          <Video className="w-16 h-16 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Live Feed Simulation</h3>
          <p className="max-w-md text-sm text-center text-muted-foreground">
            In a real-world scenario, this dashboard would display multiple live camera feeds with AI-powered overlays highlighting potential events and generating alerts automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
