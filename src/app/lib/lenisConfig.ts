/** @format */

import type { LenisOptions } from "lenis";

export const defaultLenisOptions: LenisOptions = {
  duration: 1.2,
  easing: (t) => 1 - Math.pow(1 - t, 3),
  smoothWheel: true,
  syncTouch: true,
  gestureOrientation: "vertical",
  touchMultiplier: 1.5,
};
