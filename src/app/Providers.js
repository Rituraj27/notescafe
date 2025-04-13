'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute='data-theme'
      defaultTheme='light' // Set explicit default
      enableSystem={false} // Disable system detection completely
      storageKey='notescafe-theme' // Add storage key
      disableTransitionOnChange // Prevent flashes
    >
      {children}
    </ThemeProvider>
  );
}
