'use client';

import React, { useState, useEffect } from 'react';

export default function MeshTest() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string>('');
  const [meshLoaded, setMeshLoaded] = useState(false);

  useEffect(() => {
    try {
      console.log('MeshTest: Starting component mount...');
      setMounted(true);
      
      // Test importing MeshJS
      import('@meshsdk/react')
        .then((mesh) => {
          console.log('MeshTest: MeshJS React imported successfully:', mesh);
          setMeshLoaded(true);
        })
        .catch((err) => {
          console.error('MeshTest: Failed to import @meshsdk/react:', err);
          setError(`Failed to import @meshsdk/react: ${err.message}`);
        });
    } catch (err) {
      console.error('MeshTest: Error during mount:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  if (error) {
    return (
      <div className="card">
        <h3 className="text-red-600">MeshTest Error:</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="card">
        <p>MeshTest: Loading...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className={meshLoaded ? "text-green-600" : "text-yellow-600"}>
        MeshTest: {meshLoaded ? 'Success!' : 'Loading MeshJS...'}
      </h3>
      <p>
        {meshLoaded 
          ? 'MeshJS packages loaded successfully.' 
          : 'Attempting to load MeshJS packages...'
        }
      </p>
    </div>
  );
}