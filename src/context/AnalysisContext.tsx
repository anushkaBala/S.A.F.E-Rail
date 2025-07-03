"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

type AnalysisContextType = {
  videoToAnalyze: string | null;
  location: string | null;
  setVideoToAnalyze: (videoDataUri: string | null, location: string | null) => void;
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [videoToAnalyze, setVideoData] = useState<string | null>(null);
  const [location, setLocationData] = useState<string | null>(null);

  const setVideoToAnalyzeHandler = (videoDataUri: string | null, location: string | null) => {
    setVideoData(videoDataUri);
    setLocationData(location);
  };

  return (
    <AnalysisContext.Provider value={{ videoToAnalyze, location, setVideoToAnalyze: setVideoToAnalyzeHandler }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
