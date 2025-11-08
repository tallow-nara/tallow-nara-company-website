/** @format */

"use client";

import Lenis from "lenis";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";

import { defaultLenisOptions } from "../lib/lenisConfig";

type LenisWrapperProps = {
  children: ReactNode;
  className?: string;
};

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

const LenisWrapper = ({ children, className = "" }: LenisWrapperProps) => {
  const frameRef = useRef<number>(undefined);
  const lenis = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new Lenis({ ...defaultLenisOptions });
  }, []);

  useEffect(() => {
    if (!lenis) {
      return;
    }

    const raf = (time: number) => {
      lenis.raf(time);
      frameRef.current = requestAnimationFrame(raf);
    };

    frameRef.current = requestAnimationFrame(raf);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      lenis.destroy();
    };
  }, [lenis]);

  return (
    <LenisContext.Provider value={lenis}>
      <main className={className}>{children}</main>
    </LenisContext.Provider>
  );
};

export default LenisWrapper;
