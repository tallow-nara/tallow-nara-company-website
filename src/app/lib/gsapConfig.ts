import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

export const registerGSAPPlugins = () => {
  if (pluginsRegistered || typeof window === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  pluginsRegistered = true;
};

export { gsap, ScrollTrigger };

