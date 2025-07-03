'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Video } from 'lucide-react';
import { analyzeCctvFootage, AnalyzeCctvFootageOutput } from '@/ai/flows/analyze-cctv-footage';

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

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCctvFootageOutput | null>(null);

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
      setAnalysisResult(null);
    }
  };

  const handleAnalyzeVideo = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    setAnalysisResult(null);
    const reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onload = async () => {
      try {
        const cctvFootageDataUri = reader.result as string;
        const timestamp = new Date().toISOString();
        const result = await analyzeCctvFootage({ cctvFootageDataUri, location, timestamp });
        setAnalysisResult(result);
        if(result.unaccompaniedChildrenDetected) {
            toast({
                title: "Alert: Unaccompanied Child Detected!",
                description: `Detected ${result.numberOfChildren} child(ren) at ${result.location}.`,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Analysis Complete",
                description: `No unaccompanied children were detected.`,
            });
        }
      } catch (error) {
        console.error('Analysis failed:', error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'Could not analyze the uploaded video.',
        });
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = (error) => {
        console.error('File reading failed:', error);
        toast({
            variant: 'destructive',
            title: 'File Error',
            description: 'Could not read the uploaded file.',
        });
        setLoading(false);
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
            <Button onClick={handleAnalyzeVideo} disabled={!uploadedFile || loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Video className="w-4 h-4 mr-2" />}
              {loading ? 'Analyzing...' : 'Analyze Uploaded Video'}
            </Button>
            {analysisResult && (
                <Card className="mt-4 bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-base">Analysis Result</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                         <p><strong>Unaccompanied Children:</strong> {analysisResult.unaccompaniedChildrenDetected ? `Yes (${analysisResult.numberOfChildren})` : 'No'}</p>
                        <p><strong>Location:</strong> {analysisResult.location}</p>
                        <p><strong>Timestamp:</strong> {new Date(analysisResult.timestamp).toLocaleString()}</p>
                        <p><strong>Confidence:</strong> {Math.round(analysisResult.confidenceScore * 100)}%</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
