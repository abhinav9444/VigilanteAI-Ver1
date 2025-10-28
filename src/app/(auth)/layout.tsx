'use client';

import { VigilanteAiLogo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useTheme } from "next-themes";
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authBgImage = PlaceHolderImages.find(
    (img) => img.id === 'auth-background'
  );
  // Auth pages look best in dark mode
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="flex min-h-screen w-full">
      <div className="relative hidden w-1/2 flex-col justify-between p-8 text-primary-foreground lg:flex">
        {authBgImage && (
          <Image
            src={authBgImage.imageUrl}
            alt={authBgImage.description}
            fill
            className="object-cover"
            data-ai-hint={authBgImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-zinc-900/80" />
        <div className="relative z-10 flex items-center gap-2 text-2xl font-bold">
          <VigilanteAiLogo className="h-8 w-8" />
          VigilanteAI
        </div>
        <div className="relative z-10">
          <p className="text-lg">
            "The premier solution for proactive web security. AI-driven insights
            to protect your digital assets before threats strike."
          </p>
          <footer className="mt-4 text-sm opacity-80">
            - CyberSec Weekly
          </footer>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-background p-4 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
