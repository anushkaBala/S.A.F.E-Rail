'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Video, CheckCircle } from 'lucide-react';
import { useAnalysis } from '@/context/AnalysisContext';
import Link from 'next/link';


type CctvFeedProps = {
  title: string;
  location: string;
};

export function CctvFeed({ title, location }: CctvFeedProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const { setVideoToAnalyze, videoToAnalyze, location: analysisLocation } = useAnalysis();

  const isThisVideoSetForAnalysis = videoToAnalyze && analysisLocation === location;

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
        }
      } else {
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadedVideoUrl(URL.createObjectURL(file));
      // Reset analysis state if a new video is uploaded
      if(analysisLocation === location) {
        setVideoToAnalyze(null, null);
      }
    }
  };

  const handleSetVideoForMatching = () => {
    if (!uploadedFile) return;

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onload = () => {
      const videoDataUri = reader.result as string;
      setVideoToAnalyze(videoDataUri, location);
      setIsProcessingFile(false);
      toast({
        title: "Video Ready for Analysis",
        description: (
          <span>
            The video from {location} is set. Go to the{' '}
            <Link href="/identification" className="underline font-bold">
              Child Identification
            </Link>{' '}
            page to find a match.
          </span>
        ),
      });
    };
    reader.onerror = (error) => {
        console.error('File reading failed:', error);
        toast({
            variant: 'destructive',
            title: 'File Error',
            description: 'Could not read the uploaded file.',
        });
        setIsProcessingFile(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="live">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live">Live Feed</TabsTrigger>
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
          </TabsList>
          <TabsContent value="live" className="mt-4">
            <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center relative">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                   <Alert variant="destructive">
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                      Please enable camera permissions in your browser settings.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
               {hasCameraPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="ml-2">Requesting camera access...</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="upload" className="mt-4 space-y-4">
             <div className="space-y-2">
                <label htmlFor={`upload-${title}`} className="sr-only">Upload video</label>
                <Input id={`upload-${title}`} type="file" accept="video/*" onChange={handleFileChange} />
            </div>
            {uploadedVideoUrl && (
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <video src={uploadedVideoUrl} className="w-full h-full object-cover" controls />
              </div>
            )}
            <Button onClick={handleSetVideoForMatching} disabled={!uploadedFile || isProcessingFile || isThisVideoSetForAnalysis} className="w-full">
              {isProcessingFile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (isThisVideoSetForAnalysis ? <CheckCircle className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />)}
              {isProcessingFile ? 'Processing...' : (isThisVideoSetForAnalysis ? 'Video Set for Matching' : 'Use This Video for Matching')}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
