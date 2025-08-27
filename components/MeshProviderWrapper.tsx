'use client';

import { MeshProvider } from '@meshsdk/react';
import { useState, useEffect } from 'react';

interface MeshProviderWrapperProps {
  children: React.ReactNode;
}

export default function MeshProviderWrapper({ children }: MeshProviderWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>{children}</div>;
  }

  return <MeshProvider>{children}</MeshProvider>;
}