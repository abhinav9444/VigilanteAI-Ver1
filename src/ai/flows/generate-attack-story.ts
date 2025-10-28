
'use server';

/**
 * @fileOverview Generates a plausible attack narrative based on scan results.
 *
 * - generateAttackStory - A function that takes scan details and returns a step-by-step attack story.
 * - GenerateAttackStoryInput - The input type for the generateAttackStory function.
 * - GenerateAttackStoryOutput - The return type for the generateAttackStory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAttackStoryInputSchema = z.object({
  scanDetails: z.string().describe('The full JSON object of the completed scan, including OSINT data and vulnerabilities.'),
});

export type GenerateAttackStoryInput = z.infer<typeof GenerateAttackStoryInputSchema>;

const StoryStepSchema = z.object({
    step: z.number().describe('The step number in the attack sequence.'),
    title: z.string().describe('A short, descriptive title for the attack step (e.g., "Initial Reconnaissance").'),
    description: z.string().describe('A one or two-sentence explanation of what the attacker does in this step and what they learn.'),
});

const GenerateAttackStoryOutputSchema = z.object({
  attackStory: z.array(StoryStepSchema).describe('An array of steps representing the simulated attack path.'),
});

export type GenerateAttackStoryOutput = z.infer<typeof GenerateAttackStoryOutputSchema>;

export async function generateAttackStory(input: GenerateAttackStoryInput): Promise<GenerateAttackStoryOutput> {
  return generateAttackStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAttackStoryPrompt',
  input: { schema: GenerateAttackStoryInputSchema },
  output: { schema: GenerateAttackStoryOutputSchema },
  prompt: `You are a creative security analyst tasked with creating a plausible attack narrative. Based on the provided scan results (including OSINT and vulnerabilities), construct a step-by-step story of how an attacker might compromise the target.

  The story should be a logical sequence of 3-5 steps. Start with reconnaissance and pivot based on the findings.

  **Scan Details (JSON):**
  {{{scanDetails}}}

  **Instructions:**
  1.  Create a sequence of 3-5 steps.
  2.  For each step, provide a clear 'title' and a 'description'.
  3.  The description should explain the attacker's action and goal for that step.
  4.  Connect the steps logically. For example, if Shodan shows an open database port, a later step might be "Attempt to Exploit Database." If a critical XSS vulnerability is found, a step should involve "User Session Hijacking."
  5.  Be creative but ground the story in the provided data.

  **Example Output Structure:**
  {
    "attackStory": [
      { "step": 1, "title": "Information Gathering", "description": "The attacker uses WHOIS and SSL records to map the organization's infrastructure and find related subdomains." },
      { "step": 2, "title": "Port Scanning", "description": "Using information from Shodan, the attacker identifies an exposed database port (3306) on the main server." },
      { "step": 3, "title": "Exploitation", "description": "The attacker leverages a known SQL Injection vulnerability on the login page to bypass authentication." }
    ]
  }
  `,
});

const generateAttackStoryFlow = ai.defineFlow(
  {
    name: 'generateAttackStoryFlow',
    inputSchema: GenerateAttackStoryInputSchema,
    outputSchema: GenerateAttackStoryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
