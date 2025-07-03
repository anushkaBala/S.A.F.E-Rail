import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CctvFeed } from '@/components/cctv-feed';

export default function CctvPage() {
  const feeds = [
    { id: 1, title: 'Camera 1 - Platform 5', location: 'Platform 5' },
    { id: 2, title: 'Camera 2 - Main Concourse', location: 'Main Concourse' },
    { id: 3, title: 'Camera 3 - Entrance Hall', location: 'Entrance Hall' },
    { id: 4, title: 'Camera 4 - Ticket Barrier', location: 'Ticket Barrier' },
  ];

  return (
    <Card className="bg-cctv-main">
      <CardHeader>
        <CardTitle>CCTV Analysis</CardTitle>
        <CardDescription>
          This module analyzes CCTV feeds to detect unaccompanied children. View live feeds or upload video recordings for analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {feeds.map((feed) => (
            <CctvFeed key={feed.id} title={feed.title} location={feed.location} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
