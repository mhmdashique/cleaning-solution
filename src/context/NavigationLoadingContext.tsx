"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface NavigationLoadingContextType {
  isLoading: boolean;
  loadingLabel: string;
  startLoading: (label?: string) => void;
  stopLoading: () => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isLoading: false,
  loadingLabel: "Loading...",
  startLoading: () => {},
  stopLoading: () => {},
});

// Inner component that safely uses useSearchParams() — must be inside Suspense
function NavigationResetter({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onNavigate();
  }, [pathname, searchParams, onNavigate]);

  return null;
}

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Loading...");

  const startLoading = (label = "Loading...") => {
    setLoadingLabel(label);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <NavigationLoadingContext.Provider
      value={{ isLoading, loadingLabel, startLoading, stopLoading }}
    >
      {/* Suspense-wrapped resetter: auto-clears loading when route changes */}
      <Suspense fallback={null}>
        <NavigationResetter onNavigate={() => setIsLoading(false)} />
      </Suspense>

      {children}

      {/* Global Loading Overlay — centered spinner, 30% opacity backdrop */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/30"
        >
          <Loader2 className="w-10 h-10 animate-spin text-brand-700" />
        </div>
      )}
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  return useContext(NavigationLoadingContext);
}

