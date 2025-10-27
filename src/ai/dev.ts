import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-scan-results.ts';
import '@/ai/flows/suggest-fixes.ts';
import '@/ai/flows/explain-vulnerability.ts';