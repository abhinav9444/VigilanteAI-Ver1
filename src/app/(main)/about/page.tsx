
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Linkedin,
  Link as LinkIcon,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import { teamMembers, projectGuide } from '@/lib/about-data';
import type { SVGProps } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const techStack = [
  { name: 'Next.js', Icon: (props: SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fillRule="evenodd" clipRule="evenodd" d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128ZM40.1583 110.835C45.286 113.843 51.2584 115.733 57.6533 116.321V78.3598L40.1583 110.835ZM101.442 90.9576L112.164 72.8227H90.9327L101.442 90.9576ZM90.2312 65.3113H110.388C108.973 52.3968 102.54 41.2335 93.1097 33.7279L90.2312 38.83V65.3113ZM34.7203 27.5752C42.2478 20.1903 52.3781 15.3114 63.5413 14.072V68.558L34.7203 27.5752ZM69.3788 14.156C80.4613 15.498 90.4423 20.5283 97.9181 28.181L69.3788 72.7758V14.156Z" fill="currentColor"/></svg> },
  { name: 'React', Icon: (props: SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1134 1024" fill="none"><path fill="currentColor" d="M1133.43 512.247c0-23.42-7.55-46.84-22.65-65.73l-447.8-55.858c-1.31-163.8-31.5-316.6-88.08-450.48-5.32-12.4-15.86-20.73-29.35-22.95-13.49-2.22-27.35 1.56-37.16 10.9-20.62 19.53-22.65 52.06-4.52 73.6l1.31 1.11c52.06 43.22 93.81 100.86 122.92 168.32-159.27 25.64-315.29 25.64-474.56 0 29.11-67.46 70.85-125.1 122.92-168.31l1.31-1.11c20.62-19.53 17.41-52.06-4.52-73.6-9.81-9.34-23.67-13.12-37.16-10.9-13.49 2.22-24.03 10.55-29.35 22.95C170.8 195.607 140.6 348.407 139.29 512.247l447.8 55.86c1.31 163.8 31.5 316.6 88.08 450.48 5.32 12.4 15.86 20.73 29.35 22.95 13.49 2.22 27.35-1.56 37.16-10.9 20.62-19.53 22.65-52.06 4.52-73.6l-1.31-1.11c-52.06-43.22-93.81-100.86-122.92-168.32 159.27-25.64 315.29-25.64 474.56 0-29.11 67.46-70.85 125.1-122.92 168.31l-1.31 1.11c-20.62 19.53-17.41 52.06 4.52 73.6 9.81 9.34 23.67 13.12 37.16 10.9 13.49-2.22 24.03-10.55 29.35-22.95 56.58-133.88 86.77-286.68 88.08-450.48l-447.8-55.86c-4.1-177.34 32.81-344.87 101.4-482.01 6.63-13.56 1.11-30.01-12.45-36.64-13.56-6.63-30.01-1.11-36.64 12.45-76.32 151.72-118.06 334.8-113.88 521.84L1.24 501.137c-11.28-1.56-20.62-10.9-20.62-22.95 0-13.56 10.9-24.5 24.5-24.5h1117.03c13.56 0 24.5 10.94 24.5 24.5 0 12.05-9.34 21.39-20.62 22.95l-552.79 69.17c-113.88-15.63-222.24-15.63-336.12 0L1.24 523.357C-10.04 521.8-.59 512.247 11.75 512.247h1117.03c12.34 0 .65-9.59-11.7-11.14L564.29 432.1c-113.88 15.63-222.24 15.63-336.12 0L-19.38 501.137c-11.28 1.56-20.62-7.8-20.62-19.86s9.34-22.95 20.62-22.95h1154.49c12.34 0 20.62 9.34 20.62 21.4 0 11.28-7.8 20.62-19.87 20.62z"/></svg> },
  { name: 'Firebase', Icon: (props: SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="currentColor" d="M12.98.42c-1.35-.45-2.8-.2-3.95.65L.89 7.33a2.7 2.7 0 0 0 .5 4.3l12 7.78 6-9.58L12.98.42zM.6 22.56a2.7 2.7 0 0 0-1.07 3.52l17.7 37.2a2.7 2.7 0 0 0 4.6.68L44 41.53.6 22.56zM28.4 12.63l-14.8 24.3L48.8 64c1.4.92 3.2.73 4.4-.4L61.32 54.4a2.7 2.7 0 0 0 .1-4L28.4 12.63zM50.8 1.15c-1.4-.92-3.2-.73-4.4.4L20.8 23.47l14.9 23.8 26-16.7a2.7 2.7 0 0 0 .9-3.9L50.8 1.16z"/></svg> },
  { name: 'Genkit', Icon: (props: SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M389.3 893.3L153.6 512l235.7-381.3h165.7L346.5 512l180.7 291.3h-88.6zm245.4 0L400.4 512l234.3-381.3h165.7L566.1 512l180.7 291.3H634.7z"/></svg> },
  { name: 'Gemini', Icon: (props: SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="M9.5 20.083A3.5 3.5 0 0 1 6 16.583a3.5 3.5 0 0 1 3.5-3.5h1V8.25a.75.75 0 0 1 1.5 0v5.833h-1a2 2 0 0 0-2 2 2 2 0 0 0 2 2h1v5.833a.75.75 0 0 1-1.5 0v-5.833h-1Z" /><path d="M16.5 29.083a.75.75 0 0 1-.75-.75v-5.833h-1a2 2 0 1 1 0-4h1V8.25a.75.75 0 0 1 1.5 0v10.333h1a2 2 0 1 1 0 4h-1v5.833a.75.75 0 0 1-.75.75Z" /><path d="M25.417 23.25a.75.75 0 0 1-.75-.75v-5.833h-1a2 2 0 1 1 0-4h1V8.25a.75.75 0 0 1 1.5 0v4.333h1a2 2 0 1 1 0 4h-1v5.917a.75.75 0 0 1-.75.75Z" /></g></svg> },
  { name: 'Tailwind CSS', Icon: (props: SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512s512-229.23 512-512S794.77 0 512 0zm196.41 482.88c-17.06 0-33.31-7.84-48.4-23.73c-23.1-24.53-22.3-64.24.4-88.38c22.7-24.14 59.2-25.75 83.15-2.82c16.03 15.35 25.02 36.3 25.02 57.54c.01 21.23-8.98 42.19-25.01 57.53c-15.09 15.89-31.34 23.73-48.4 23.73zm-392.82 0c-17.06 0-33.31-7.84-48.4-23.73c-23.1-24.53-22.3-64.24.4-88.38c22.7-24.14 59.2-25.75 83.15-2.82c16.03 15.35 25.02 36.3 25.02 57.54c.01 21.23-8.98 42.19-25.01 57.53c-15.09 15.89-31.34 23.73-48.4 23.73z"/></svg> },
  { name: 'VirusTotal', Icon: (props: SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.33 2.13a.99.99 0 0 0-.58-.12c-.22 0-.44.07-.63.2l-5.6 3.23a1 1 0 0 0-.52.88v6.56a1 1 0 0 0 .52.88l5.6 3.23c.38.22.88.22 1.26 0l5.6-3.23a1 1 0 0 0 .52-.88V6.11a1 1 0 0 0-.52-.88l-5.6-3.22a.93.93 0 0 0-.68-.08zM12 4.29l4.48 2.58-1.5 2.61-4.5-2.6a1 1 0 0 0-1 0l-4.5 2.6-1.5-2.6L12 4.29zm-5.5 8.29L11 15.1v3.3L6.5 15.8v-3.22zm1 0v3.22L12 15.1v-3.3l-4.5-2.61zm2 .02l4.5 2.6v3.3l-4.5-2.58v-3.32zm6-4.52L13 10.6v3.3l4.5-2.58v-3.23zM12 11.29l4.5-2.6v3.3l-4.5 2.6v-3.3z" fill="currentColor"/></svg> },
  { name: 'Shodan', Icon: (props: SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.42 1.63H5.58A1.93 1.93 0 0 0 4 2.6v18.8a1.93 1.93 0 0 0 1.58 1.97h12.84A1.93 1.93 0 0 0 20 21.4V2.6a1.93 1.93 0 0 0-1.58-.97zM7.5 19.5a1.5 1.5 0 1 1 1.5-1.5a1.5 1.5 0 0 1-1.5 1.5zm0-4a1.5 1.5 0 1 1 1.5-1.5a1.5 1.5 0 0 1-1.5 1.5zm0-4a1.5 1.5 0 1 1 1.5-1.5a1.5 1.5 0 0 1-1.5 1.5zm0-4a1.5 1.5 0 1 1 1.5-1.5a1.5 1.5 0 0 1-1.5 1.5zm9 12a1.5 1.5 0 1 1 1.5-1.5a1.5 1.5 0 0 1-1.5 1.5zm0-4a1.5 1.5 0 1 1 1.5-1.5a1.5 1.5 0 0 1-1.5 1.5zm0-4a1.5 1.5 0 1 1 1.5-1.5a1.5 1.5 0 0 1-1.5 1.5zm0-4a1.5 1.5 0 1 1 1.5-1.5a1.5 1.5 0 0 1-1.5 1.5z" fill="currentColor"/></svg> },
  { name: 'WHOIS', Icon: (props: SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-12h2v2h-2zm0 4h2v6h-2z"/></svg> },
];


export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About VigilanteAI</h1>
        <p className="text-muted-foreground mt-1">
          This project, developed as part of the 7th-semester curriculum, is a
          collaborative academic effort focused on exploring AI-driven web
          vulnerability detection under faculty supervision.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            VigilanteAI is an AI-powered web vulnerability scanner developed to
            proactively identify, analyze, and report potential security
            threats across web applications. This project combines advanced
            artificial intelligence with traditional cybersecurity principles
            to assist researchers, law enforcement agencies, and cybersecurity
            professionals in early threat detection and system hardening.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground grid gap-2">
          <div className="flex justify-between">
            <span className="font-semibold">Project Name:</span>
            <span>VigilanteAI</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Course:</span>
            <span>
              B.Tech – 7th Semester, Computer Science and Engineering
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Project Type:</span>
            <span>Major Project / Project - 1</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Institution:</span>
            <span>Kalinga Institute of Industrial Technology</span>
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Technology Stack</h2>
         <p className="text-muted-foreground mt-1">Powered by modern technologies and AI-driven intelligence.</p>
        <div className="mt-4">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {techStack.map((tech, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
                        <tech.Icon className="h-16 w-16 text-foreground" />
                        <span className="text-md font-semibold mt-4">{tech.name}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Project Guide</h2>
        <div className="mt-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={projectGuide.imageUrl}
                  alt={projectGuide.name}
                />
                <AvatarFallback>
                  {projectGuide.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{projectGuide.name}</h3>
                <p className="text-muted-foreground">
                  {projectGuide.designation}
                </p>
                <div className="flex gap-2">
                  {projectGuide.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={projectGuide.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}
                  {projectGuide.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={projectGuide.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Special Thanks</h2>
         <Card className="mt-4">
            <CardContent className="p-6 text-muted-foreground">
                <p>
                We extend our sincere gratitude to our guide, Dr. Ranjita Kumari Dash, for her mentorship, and to the Department of Computer Science and Engineering for continuous support.
                </p>
            </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Meet the Team</h2>
        <div className="grid gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.rollNumber}>
              <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={member.imageUrl} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>Roll No: {member.rollNumber}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            LEGAL DISCLAIMER & NOTICE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Disclaimer</h3>
            <p className="text-muted-foreground">
              VigilanteAI is a cybersecurity research and educational tool
              designed to assist users in identifying potential vulnerabilities
              on systems they own or have explicit authorization to test. It is
              intended solely for lawful and ethical use in compliance with
              applicable cybersecurity and data protection laws.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Notice of Authorized Use
            </h3>
            <p className="text-muted-foreground mb-4">
              By using VigilanteAI, you acknowledge and agree that:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                You will only scan systems, websites, or networks that you
                personally own or for which you have explicit, written consent
                from the owner.
              </li>
              <li className="font-semibold text-foreground">
                You understand that unauthorized vulnerability scanning,
                penetration testing, or exploitation of third-party systems may
                violate laws such as the Indian IT Act 2000, the Computer Misuse
                Act, or other regional cybersecurity regulations.
              </li>
              <li>
                The developers, contributors, and maintainers of VigilanteAI
                assume no liability for misuse, damages, or legal consequences
                arising from unauthorized or unethical use of this software.
              </li>
            </ul>
          </div>
          <div>
            <p className="text-muted-foreground mb-4">
              This tool should be used for defensive and educational
              cybersecurity purposes only, such as:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Security auditing of authorized assets</li>
              <li>Academic research and learning</li>
              <li>Internal organization security assessments</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Warning</h3>
            <p className="text-muted-foreground">
              Engaging in unauthorized scanning or data probing activities on
              systems without permission is illegal and may lead to civil or
              criminal penalties. Always obtain proper authorization before
              running any scan.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Ethical Usage
            </h3>
            <p className="text-muted-foreground">
              VigilanteAI supports responsible disclosure practices. If
              vulnerabilities are discovered, users are encouraged to notify
              affected parties responsibly and in good faith.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <footer className="text-center text-muted-foreground py-8">
        <p className="flex items-center justify-center gap-2 text-sm">
          Powered with
          <span className="relative flex h-5 w-5">
            <Heart className="absolute inline-flex h-full w-full animate-ping text-red-400 opacity-75" />
            <Heart className="relative inline-flex h-5 w-5 fill-red-500 text-red-500" />
          </span>
          and cutting-edge technology.
        </p>
      </footer>
    </div>
  );
}
