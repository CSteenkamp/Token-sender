'use client';

import { ThemeProvider } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';

export default function DynamicThemeControls() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}