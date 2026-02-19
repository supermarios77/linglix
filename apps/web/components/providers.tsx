"use client";

// Themes
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Posthog
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // init already done in instrumentation, but ensure loaded
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </PostHogProvider>
  );
}
