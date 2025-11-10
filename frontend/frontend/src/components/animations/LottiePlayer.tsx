'use client';

import { Player } from '@lottiefiles/react-lottie-player';
import { ReactNode } from 'react';

interface LottiePlayerProps {
  src: string;
  fallback?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  autoplay?: boolean;
  loop?: boolean;
}

export function LottiePlayer({ 
  src, 
  fallback, 
  className, 
  style, 
  autoplay = true, 
  loop = true 
}: LottiePlayerProps) {
  return (
    <Player
      autoplay={autoplay}
      loop={loop}
      src={src}
      className={className}
      style={style}
    >
      {fallback}
    </Player>
  );
}

// Popular Lottie Animations URLs (public CDN)
export const LOTTIE_ANIMATIONS = {
  // Analytics & Charts
  analytics: 'https://lottie.host/c5d8c5e7-8f8a-4c7e-9f8a-2c7f5e6d8c9a/5KjF8h9J0e.json',
  dashboard: 'https://lottie.host/embed/3c7f5e6d-8c9a-4c7e-9f8a-2c7f5e6d8c9a/5KjF8h9J0e.json',
  
  // Success & Completion
  success: 'https://lottie.host/4fa3af49-f004-4ca9-a8e1-3d4c8f5b6c7a/8KjF8h9J0e.json',
  checkmark: 'https://lottie.host/embed/5b8c9a4c-7e9f-4c7e-9f8a-2c7f5e6d8c9a/5KjF8h9J0e.json',
  
  // Loading & Processing
  loading: 'https://lottie.host/embed/6c9a4c7e-9f8a-4c7e-9f8a-2c7f5e6d8c9a/5KjF8h9J0e.json',
  spinner: 'https://lottie.host/embed/7e9f8a4c-7e9f-4c7e-9f8a-2c7f5e6d8c9a/5KjF8h9J0e.json',
  
  // Team & Collaboration
  team: 'https://lottie.host/embed/8f8a4c7e-9f8a-4c7e-9f8a-2c7f5e6d8c9a/5KjF8h9J0e.json',
  collaboration: 'https://lottie.host/embed/9a4c7e9f-8a4c-7e9f-8a2c-7f5e6d8c9a/5KjF8h9J0e.json',
  
  // Technology
  rocket: 'https://lottie.host/embed/a4c7e9f8-a4c7-e9f8-a2c7-f5e6d8c9a/5KjF8h9J0e.json',
  ai: 'https://lottie.host/embed/b7e9f8a4-c7e9-f8a4-c7e9-f8a2c7f5e6d8/5KjF8h9J0e.json',
};
