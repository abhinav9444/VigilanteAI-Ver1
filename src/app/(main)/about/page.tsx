
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
