import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-scan-results.ts';
import '@/ai/flows/suggest-fixes.ts';
import '@/ai/flows/explain-vulnerability.ts';
import '@/ai/flows/assess-vulnerability.ts';
import '@/ai/flows/osint-enrichment.ts';
import '@/ai/flows/get-scan-summary.ts';
import '@/ai/flows/generate-attack-story.ts';
import '@/ai/tools/osint-tools.ts';
