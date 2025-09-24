"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PerformanceContextType {
  highPerformanceMode: boolean;
  togglePerformanceMode: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [highPerformanceMode, setHighPerformanceMode] = useState(false);

  useEffect(() => {
    // Check if device has limited performance capabilities
    const isLowPerformanceDevice = 
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isLowPerformanceDevice) {
      setHighPerformanceMode(true);
    }
  }, []);

  const togglePerformanceMode = () => {
    setHighPerformanceMode(prev => !prev);
  };

  return (
    <PerformanceContext.Provider value={{ highPerformanceMode, togglePerformanceMode }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}