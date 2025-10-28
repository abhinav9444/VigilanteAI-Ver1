'use server';
/**
 * @fileOverview Defines a set of Genkit tools for gathering Open-Source Intelligence (OSINT).
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ShodanDataSchema, virusTotalToolOutputSchema, SslmateDataSchema } from '@/lib/definitions';
import dns from 'dns';
import { promisify } from 'util';


const lookup = promisify(dns.lookup);

export const getIpAddress = ai.defineTool(
    {
        name: 'getIpAddress',
        description: 'Resolves a domain name to an IP address.',
        inputSchema: z.object({ domain: z.string().describe('The domain name to resolve.') }),
        outputSchema: z.string().describe('The resolved IP address.'),
    },
    async (input) => {
        try {
            const { address } = await lookup(input.domain);
            return address;
        } catch (error) {
            console.error(`Failed to resolve IP for ${input.domain}:`, error);
            // Return an empty string or handle the error as appropriate
            return '';
        }
    }
);


export const getVirusTotalInfo = ai.defineTool(
  {
    name: 'getVirusTotalInfo',
    description: 'Retrieves security analysis of a domain from VirusTotal.',
    inputSchema: z.object({
      domain: z.string().describe('The domain name to query.'),
    }),
    outputSchema: virusTotalToolOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      console.warn('VirusTotal API key is not configured. Returning mock data.');
      // Return mock data if API key is missing
      return {
        last_analysis_stats: { harmless: 70, malicious: 0, suspicious: 0, undetected: 10, timeout: 0 },
        reputation: 0,
        last_modification_date: Math.floor(Date.now() / 1000) - 86400,
      };
    }
    
    const url = `https://www.virustotal.com/api/v3/domains/${input.domain}`;
    const options = {
      method: 'GET',
      headers: {
        'x-apikey': apiKey,
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        console.error(`VirusTotal API error: ${response.statusText}`);
        throw new Error('Failed to fetch from VirusTotal');
      }
      const data = await response.json();
      return data.data.attributes;
    } catch (error) {
      console.error('Error calling VirusTotal API:', error);
      throw error;
    }
  }
);


const whoisToolOutputSchema = z.object({
    WhoisRecord: z.any()
});

export const getWhoisInfo = ai.defineTool(
    {
        name: 'getWhoisInfo',
        description: 'Retrieves WHOIS information for a domain.',
        inputSchema: z.object({
            domain: z.string().describe('The domain name to query.'),
        }),
        outputSchema: whoisToolOutputSchema,
    },
    async (input) => {
        const apiKey = process.env.WHOISXML_API_KEY;
        if (!apiKey) {
            console.warn('WHOISXML API key not configured.');
            return { WhoisRecord: { error: 'API key not configured.' } };
        }

        const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${input.domain}&outputFormat=JSON`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`WHOISXML API error: ${response.statusText}`);
                throw new Error('Failed to fetch from WHOISXML API');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error calling WHOISXML API:', error);
            throw error;
        }
    }
);

export const getShodanInfo = ai.defineTool(
  {
    name: 'getShodanInfo',
    description: 'Retrieves host information from Shodan for a given IP address.',
    inputSchema: z.object({
      ip: z.string().describe('The IP address to query.'),
    }),
    outputSchema: ShodanDataSchema,
  },
  async (input) => {
    const apiKey = process.env.SHODAN_API_KEY;
    if (!apiKey) {
      console.warn('Shodan API key is not configured.');
      throw new Error('Shodan API key not configured.');
    }
    
    const url = `https://api.shodan.io/shodan/host/${input.ip}?key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Shodan API can return non-200 for known reasons e.g. "No information available for that IP."
        if (response.status === 404) {
            return { error: `No information available for IP: ${input.ip}` };
        }
        console.error(`Shodan API error: ${response.statusText}`);
        throw new Error(`Failed to fetch from Shodan API: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling Shodan API:', error);
      throw error;
    }
  }
);


export const getSslmateInfo = ai.defineTool(
    {
        name: 'getSslmateInfo',
        description: 'Retrieves SSL/TLS certificate information from SSLMate Cert Spotter API.',
        inputSchema: z.object({
            domain: z.string().describe('The domain to query for certificate issuances.'),
        }),
        outputSchema: z.array(SslmateDataSchema),
    },
    async (input) => {
        const apiKey = process.env.SSLMATE_API_KEY;
        if (!apiKey) {
            console.warn('SSLMate API key not configured.');
            return []; // Return empty array if no key
        }

        const url = `https://api.certspotter.com/v1/issuances?domain=${input.domain}&include_subdomains=true&expand=dns_names,issuer`;
        
        const headers = {
            'Authorization': `Bearer ${apiKey}`
        };

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`SSLMate API error: ${response.status} ${response.statusText}`, errorText);
                // Return empty array on error to avoid breaking the entire OSINT flow
                return []; 
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error calling SSLMate API:', error);
            return [];
        }
    }
);
