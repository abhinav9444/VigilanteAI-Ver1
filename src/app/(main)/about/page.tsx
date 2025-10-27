
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
import { Linkedin, Link as LinkIcon, Heart } from 'lucide-react';
import { teamMembers, projectGuide } from '@/lib/about-data';

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About The Project</h1>
        <p className="text-muted-foreground mt-1">
          Information about the project, the guide, and the talented team behind
          it.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Project:</span>{' '}
            Project - 1
          </p>
          <p>
            <span className="font-semibold text-foreground">Semester:</span> 7th
            Semester
          </p>
          <p className="mt-4">
            This application, VigilanteAI, is an AI-powered web vulnerability
            scanner designed to proactively identify and report security threats.
          </p>
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

      <footer className="text-center text-muted-foreground py-8">
        <p className="flex items-center justify-center gap-2 text-sm">
          Crafted with
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
