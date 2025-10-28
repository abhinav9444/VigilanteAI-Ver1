'use client';

import { VigilanteAiLogo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useTheme } from "next-themes";
import { useEffect, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authBgImages = PlaceHolderImages.filter(
    (img) => img.id.startsWith('auth-background')
  );
  
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  // Auth pages look best in dark mode
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="flex min-h-screen w-full">
      <div className="relative hidden w-1/2 lg:block">
        <Carousel
          className="absolute inset-0 w-full h-full"
          plugins={[plugin.current]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {authBgImages.map((image, index) => (
              <CarouselItem key={image.id}>
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover"
                  data-ai-hint={image.imageHint}
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="relative z-10 flex h-full flex-col justify-between bg-zinc-900/80 p-8 text-primary-foreground">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <VigilanteAiLogo className="h-8 w-8" />
            VigilanteAI
          </div>
          <div>
            <p className="text-lg">
              "The premier solution for proactive web security. AI-driven insights
              to protect your digital assets before threats strike."
            </p>
            <footer className="mt-4 text-sm opacity-80">
              - CyberSec Weekly
            </footer>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-background p-4 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
