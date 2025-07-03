"use client";

import { useState } from 'react';
import { useFlow } from '@genkit-ai/next/client';
import { identifyChildFromUpload, IdentifyChildFromUploadOutput } from '@/ai/flows/identify-child-from-upload';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Flag, Check, Edit, ScanFace } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function IdentificationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyChildFromUploadOutput | null>(null);
  const { run: identifyChild, loading } = useFlow(identifyChildFromUpload);
  const { toast } = useToast();

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

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const photoDataUri = reader.result as string;
        const response = await identifyChild({ photoDataUri });
        setResult(response);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to analyze the image. Please try again.",
        });
      }
    };
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Select an image to identify a child.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button onClick={handleSubmit} disabled={!file || loading} className="w-full bg-accent hover:bg-accent/90">
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
                   <Badge variant={result.confidenceScore > 0.9 ? 'default' : 'secondary'} style={{backgroundColor: result.confidenceScore > 0.9 ? "hsl(var(--primary))" : "hsl(var(--secondary))"}}>
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
            <Button variant="outline"><Flag className="w-4 h-4 mr-2" />Flag</Button>
            <Button variant="outline"><Edit className="w-4 h-4 mr-2" />Update</Button>
            <Button className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-2" />Approve</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
