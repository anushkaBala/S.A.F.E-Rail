"use client";

import { useState } from 'react';
import { identifyChildFromUpload, IdentifyChildFromUploadInput, IdentifyChildFromUploadOutput } from '@/ai/flows/identify-child-from-upload';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Flag, Check, Edit, ScanFace } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function IdentificationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyChildFromUploadOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    if (!file) return;
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const photoDataUri = reader.result as string;
        
        const input: IdentifyChildFromUploadInput = { photoDataUri };
        if (age) input.age = parseInt(age, 10);
        if (gender) input.gender = gender;
        if (spectacles) input.wearsSpectacles = spectacles === 'yes';

        const response = await identifyChildFromUpload(input);
        setResult(response);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to analyze the image. Please try again.",
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
        description: "There was an error reading the file.",
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
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Select an image and provide details to identify a child.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" placeholder="Enter estimated age" value={age} onChange={(e) => setAge(e.target.value)} />
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
        <CardFooter>
          <Button onClick={handleSubmit} disabled={!file || loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? 'Analyzing...' : 'Identify Child'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
          <CardDescription>Review the identification details below.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="w-16 h-16 mb-4 animate-spin" />
              <p>Analyzing Image...</p>
            </div>
          ) : result ? (
            result.isChildIdentified ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{result.childDetails?.name || 'Unidentified Child'}</h3>
                   <Badge variant={result.confidenceScore > 0.9 ? 'default' : 'secondary'} className="bg-primary text-primary-foreground">
                    {Math.round(result.confidenceScore * 100)}% Confidence
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Age:</strong> {result.childDetails?.age || 'N/A'}</p>
                  <p><strong>Guardian Contact:</strong> {result.childDetails?.guardianContact || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <p>No child identified in the uploaded image.</p>
            )
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ScanFace className="w-16 h-16 mb-4" />
              <p>Results will appear here</p>
            </div>
          )}
        </CardContent>
        {result?.isChildIdentified && (
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
