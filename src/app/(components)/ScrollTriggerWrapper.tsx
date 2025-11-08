'use client';

import type { ReactNode } from "react";
import { useEffect } from "react";

import {
  ScrollTrigger,
  registerGSAPPlugins,
} from "../lib/gsapConfig";
import { useLenis } from "./LenisWrapper";

type ScrollTriggerWrapperProps = {
  children: ReactNode;
};

const ScrollTriggerWrapper = ({ children }: ScrollTriggerWrapperProps) => {
  const lenis = useLenis();

  useEffect(() => {
    registerGSAPPlugins();
  }, []);

  useEffect(() => {
    if (!lenis || typeof window === "undefined") {
      return;
    }

    const updateScroll = () => ScrollTrigger.update();
    const handleRefresh = () => lenis.resize();

    lenis.on("scroll", updateScroll);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }

        return window.scrollY || 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.addEventListener("refresh", handleRefresh);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", updateScroll);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
    };
  }, [lenis]);

  return <>{children}</>;
};

export default ScrollTriggerWrapper;
