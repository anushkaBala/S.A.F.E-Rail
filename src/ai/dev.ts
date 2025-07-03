import { config } from 'dotenv';
config();

import '@/ai/flows/identify-child-from-upload.ts';
import '@/ai/flows/analyze-cctv-footage.ts';
import '@/ai/flows/match-child-in-video.ts';
import '@/ai/flows/generate-dashboard-image.ts';
import '@/ai/flows/generate-person-image.ts';
