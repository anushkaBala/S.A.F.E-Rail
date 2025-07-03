import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function CctvPage() {
  const feeds = [
    { id: 1, title: 'Camera 1 - Platform 5', hint: 'cctv train platform' },
    { id: 2, title: 'Camera 2 - Main Concourse', hint: 'cctv station concourse' },
    { id: 3, title: 'Camera 3 - Entrance Hall', hint: 'cctv entrance' },
    { id: 4, title: 'Camera 4 - Ticket Barrier', hint: 'cctv ticket barrier' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>CCTV Analysis</CardTitle>
        <CardDescription>
          This module continuously analyzes live CCTV feeds to detect unaccompanied children in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {feeds.map((feed) => (
            <Card key={feed.id}>
              <CardHeader>
                <CardTitle className="text-lg">{feed.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                  <Image src="https://placehold.co/600x400.png" width={600} height={400} alt={`CCTV Feed ${feed.id}`} className="w-full h-full object-cover" data-ai-hint={feed.hint} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
