'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

interface MeshProviderWrapperProps {
  children: React.ReactNode;
}

const MeshProvider = dynamic(
  () => import('@meshsdk/react').then((mod) => mod.MeshProvider),
  { ssr: false }
);

export default function MeshProviderWrapper({ children }: MeshProviderWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return <MeshProvider>{children}</MeshProvider>;
}