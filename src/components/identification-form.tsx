
"use client";

import { useState } from 'react';
import {
  matchChildInVideo,
  MatchChildInVideoInput,
  MatchChildInVideoOutput,
} from '@/ai/flows/match-child-in-video';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Flag, Check, Edit, ScanFace, Video, UserSearch, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalysis } from '@/context/AnalysisContext';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function IdentificationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<MatchChildInVideoOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { videoToAnalyze, location } = useAnalysis();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [spectacles, setSpectacles] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
        toast({
            variant: "destructive",
            title: "No Photo Uploaded",
            description: "Please upload a photo of the child to search for.",
        });
        return;
    }
    if (!videoToAnalyze || !location) {
        toast({
            variant: "destructive",
            title: "No Video Selected",
            description: "Please go to the CCTV Analysis page and select a video first.",
        });
        return;
    }

    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const childPhotoDataUri = reader.result as string;
        
        const input: MatchChildInVideoInput = { 
            videoDataUri: videoToAnalyze,
            childPhotoDataUri,
            location
        };

        const response = await matchChildInVideo(input);
        setResult(response);

         if (response.isMatchFound) {
            toast({
                title: "Match Found!",
                description: `A match was found in the video from ${response.location}.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "No Match Found",
                description: `The child was not found in the video from ${location}.`,
            });
        }

      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to analyze the image and video. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      console.error("FileReader error");
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "There was an error reading the child's photo.",
      });
      setLoading(false);
    };
  };

  const handleResultAction = (action: 'Flagged' | 'Updated' | 'Approved') => {
    toast({
      title: `Result ${action}`,
      description: `The identification result has been ${action.toLowerCase()}.`,
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-success text-success-foreground">
        <CardHeader>
          <CardTitle>1. Child Details &amp; Photo</CardTitle>
          <CardDescription className="text-success-foreground/80">Select an image and provide details to identify a child.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="text" inputMode="numeric" placeholder="Enter estimated age" value={age} onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={setGender} value={gender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Spectacles</Label>
            <RadioGroup value={spectacles} onValueChange={setSpectacles} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="spectacles-yes" />
                <Label htmlFor="spectacles-yes">With Spectacles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="spectacles-no" />
                <Label htmlFor="spectacles-no">Without Spectacles</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-border hover:bg-accent/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {preview ? (
                        <Image src={preview} alt="Image preview" width={128} height={128} className="object-contain h-48 rounded-md" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 10MB)</p>
                        </>
                    )}
                </div>
                <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
            </label>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
            {videoToAnalyze ? (
                <Alert variant="default" className="bg-green-900/20 border-green-700">
                    <Video className="h-4 w-4" />
                    <AlertTitle>Video Ready</AlertTitle>
                    <AlertDescription>
                        CCTV footage from <strong>{location}</strong> is ready for analysis.
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Video Selected</AlertTitle>
                    <AlertDescription>
                        Please go to the CCTV Analysis page to select a video.
                    </AlertDescription>
                </Alert>
            )}
          <Button onClick={handleSubmit} disabled={!file || !videoToAnalyze || loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? 'Analyzing...' : 'Find Match in CCTV Video'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>2. Analysis Result</CardTitle>
          <CardDescription>The result of the video analysis will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="w-16 h-16 mb-4 animate-spin" />
              <p>Searching for child in video from {location}...</p>
            </div>
          ) : result ? (
            result.isMatchFound ? (
              <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Match Found!</h3>
                    <p className="text-sm text-muted-foreground">A match was found in the video from <strong>{result.location}</strong>.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <Label>Match Confidence</Label>
                        <Badge variant={result.matchConfidence! > 0.9 ? 'default' : 'secondary'} className="text-lg bg-primary text-primary-foreground w-full justify-center">
                            {Math.round(result.matchConfidence! * 100)}%
                        </Badge>
                    </div>
                     <div className="space-y-1">
                        <Label>Provided Details</Label>
                        <div className="flex flex-wrap gap-2">
                            {gender && <Badge variant="outline">{gender}</Badge>}
                            {age && <Badge variant="outline">~{age} yrs</Badge>}
                            {spectacles && <Badge variant="outline">{spectacles === 'yes' ? 'Spectacles' : 'No Specs'}</Badge>}
                        </div>
                    </div>
                </div>
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <UserSearch className="w-16 h-16 mb-4" />
                    <p className='text-center'>No match found for the child in the video from <br/><strong>{result.location}</strong>.</p>
                </div>
            )
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ScanFace className="w-16 h-16 mb-4" />
              <p>Results will appear here</p>
            </div>
          )}
        </CardContent>
        {result?.isMatchFound && (
           <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResultAction('Flagged')}><Flag className="w-4 h-4 mr-2" />Flag</Button>
            <Button variant="outline" onClick={() => handleResultAction('Updated')}><Edit className="w-4 h-4 mr-2" />Update</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleResultAction('Approved')}><Check className="w-4 h-4 mr-2" />Approve</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
