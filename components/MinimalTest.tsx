'use client';

import React, { useState, useEffect } from 'react';

export default function MinimalTest() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      console.log('MinimalTest: Component mounting...');
      setMounted(true);
      console.log('MinimalTest: Successfully mounted');
    } catch (err) {
      console.error('MinimalTest: Error during mount:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  if (error) {
    return (
      <div className="card">
        <h3 className="text-red-600">MinimalTest Error:</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="card">
        <p>MinimalTest: Loading...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-green-600">MinimalTest: Success!</h3>
      <p>Basic React component is working correctly.</p>
    </div>
  );
}