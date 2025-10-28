'use client';

import { VigilanteAiLogo } from '@/components/logo';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


const quotes = [
  {
    text: 'Security isn’t a product — it’s a continuous mindset.',
    author: 'VigilanteAI',
  },
  {
    text: 'The best defense is awareness — VigilanteAI helps you stay ahead.',
    author: 'VigilanteAI',
  },
  {
    text: 'Every scan is a lesson, every vulnerability a chance to strengthen.',
    author: 'VigilanteAI',
  },
  {
    text: 'Proactive defense begins with knowledge, not fear.',
    author: 'VigilanteAI',
  },
  {
    text: 'Before someone finds your weakness — find it yourself.',
    author: 'VigilanteAI',
  },
  {
    text: 'Security isn’t about breaking systems, it’s about understanding them.',
    author: 'VigilanteAI',
  },
  {
    text: 'AI can’t replace human intuition, but it can make it sharper.',
    author: 'VigilanteAI',
  },
];

const contributors = ['22051564', '22053293', '22053284', '22052323'];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authBgImages = PlaceHolderImages.filter((img) =>
    img.id.startsWith('auth-background-')
  );

  const [currentBgImage, setCurrentBgImage] = useState<ImagePlaceholder | null>(null);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Auth pages look best in dark mode
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  useEffect(() => {
    // Select a random image and quote on the client side to avoid hydration mismatch
    if (authBgImages.length > 0) {
      setCurrentBgImage(
        authBgImages[Math.floor(Math.random() * authBgImages.length)]
      );
    }
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [authBgImages]);

  return (
    <div className="flex min-h-screen w-full">
      <div className="relative hidden w-1/2 lg:block bg-black">
        {currentBgImage && (
          <Image
            src={currentBgImage.imageUrl}
            alt={currentBgImage.description}
            fill
            className={cn(
                "object-cover transition-opacity duration-1000 ease-in-out",
                isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            data-ai-hint={currentBgImage.imageHint}
            onLoad={() => setIsImageLoaded(true)}
            priority
          />
        )}
        <div className="relative z-10 flex h-full flex-col justify-between bg-zinc-900/80 p-8 text-primary-foreground">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <VigilanteAiLogo className="h-8 w-8" />
              VigilanteAI
            </div>
            <p className="text-base text-muted-foreground max-w-prose">
              VigilanteAI is an AI-assisted web vulnerability scanner that helps
              users analyze websites for basic security issues and gather
              useful information through integrated OSINT and scanning tools.
            </p>
             <div className="text-sm text-muted-foreground pt-2">
              <p>Major Project-1</p>
              <p>B.Tech Computer Science and Engineering - 2022 Batch</p>
            </div>
          </div>
          <div
            className={cn(
              'transition-opacity duration-1000 ease-in-out',
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <p className="text-lg">"{currentQuote.text}"</p>
            <footer className="mt-4 text-sm opacity-80">
              - {currentQuote.author}
            </footer>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-background p-4 lg:w-1/2 relative">
         <div className="absolute top-4 right-4">
            <Button variant="link" asChild>
                <Link href="/about">Project Overview</Link>
            </Button>
        </div>
        {children}
        <div className="absolute bottom-4 text-center text-xs text-muted-foreground">
            <p>Contributors: {contributors.join(' | ')}</p>
        </div>
      </div>
    </div>
  );
}
