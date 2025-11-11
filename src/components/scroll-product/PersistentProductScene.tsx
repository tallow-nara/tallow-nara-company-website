/** @format */

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
} from "@react-three/drei";
import { useMotionValueEvent, useScroll } from "framer-motion";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  SpotLight,
  Vector3,
  type Euler,
} from "three";
import * as THREE from "three";

const SCROLL_SCENES = [
  "hero",
  "why",
  "highlight",
  "commitment",
  "testimonials",
  "cta",
  "footer",
] as const;

type ScrollSceneId = (typeof SCROLL_SCENES)[number];

type ScenePreset = {
  id: ScrollSceneId;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  floatStrength: number;
  spin: number;
  opacity: number;
  light: {
    keyIntensity: number;
    fillIntensity: number;
    rimIntensity: number;
    ambientIntensity: number;
    exposure: number;
    keyColor: string;
    fillColor: string;
    rimColor: string;
  };
};

type SceneBlendState = {
  current: ScrollSceneId;
  next: ScrollSceneId;
  blend: number;
};

type SectionMeasurement = {
  id: ScrollSceneId;
  start: number;
  end: number;
  center: number;
};

const degToRad = (value: number) => (value * Math.PI) / 180;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const sceneScript: Record<ScrollSceneId, ScenePreset> = {
  hero: {
    id: "hero",
    position: [0, -0.1, 0],
    rotation: [degToRad(-8), degToRad(10), degToRad(0)],
    scale: 1.05,
    floatStrength: 0.12,
    spin: degToRad(8),
    opacity: 1,
    light: {
      keyIntensity: 1.65,
      fillIntensity: 0.75,
      rimIntensity: 0.8,
      ambientIntensity: 0.65,
      exposure: 1.05,
      keyColor: "#f6d6ac",
      fillColor: "#d8e0c0",
      rimColor: "#fff1d6",
    },
  },
  why: {
    id: "why",
    position: [-0.8, 0.1, 0.4],
    rotation: [degToRad(-5), degToRad(25), degToRad(-2)],
    scale: 1,
    floatStrength: 0.09,
    spin: degToRad(5),
    opacity: 1,
    light: {
      keyIntensity: 1.35,
      fillIntensity: 0.65,
      rimIntensity: 0.6,
      ambientIntensity: 0.55,
      exposure: 1,
      keyColor: "#f1e2bd",
      fillColor: "#ced9be",
      rimColor: "#fff6e6",
    },
  },
  highlight: {
    id: "highlight",
    position: [0, 0.25, 0],
    rotation: [degToRad(-2), degToRad(50), degToRad(0)],
    scale: 1.05,
    floatStrength: 0.18,
    spin: degToRad(18),
    opacity: 1,
    light: {
      keyIntensity: 1.15,
      fillIntensity: 0.55,
      rimIntensity: 0.5,
      ambientIntensity: 0.6,
      exposure: 0.94,
      keyColor: "#f3dcc2",
      fillColor: "#c8d2b5",
      rimColor: "#fff2df",
    },
  },
  commitment: {
    id: "commitment",
    position: [0.05, -0.05, 0.2],
    rotation: [degToRad(-1), degToRad(10), degToRad(0)],
    scale: 1.08,
    floatStrength: 0.05,
    spin: degToRad(2),
    opacity: 1,
    light: {
      keyIntensity: 1.5,
      fillIntensity: 0.55,
      rimIntensity: 0.9,
      ambientIntensity: 0.6,
      exposure: 1.08,
      keyColor: "#ffe2b0",
      fillColor: "#d5e2c3",
      rimColor: "#fff4c9",
    },
  },
  testimonials: {
    id: "testimonials",
    position: [0.75, -0.35, 0.4],
    rotation: [degToRad(-4), degToRad(-12), degToRad(4)],
    scale: 0.98,
    floatStrength: 0.08,
    spin: degToRad(6),
    opacity: 0.9,
    light: {
      keyIntensity: 0.95,
      fillIntensity: 0.75,
      rimIntensity: 0.5,
      ambientIntensity: 0.7,
      exposure: 0.92,
      keyColor: "#f2dec8",
      fillColor: "#c5d3bb",
      rimColor: "#fceede",
    },
  },
  cta: {
    id: "cta",
    position: [0, 0, 0],
    rotation: [degToRad(-3), degToRad(0), degToRad(0)],
    scale: 1.1,
    floatStrength: 0.07,
    spin: degToRad(1.5),
    opacity: 1,
    light: {
      keyIntensity: 1.68,
      fillIntensity: 0.85,
      rimIntensity: 0.95,
      ambientIntensity: 0.65,
      exposure: 1.1,
      keyColor: "#f8dcb4",
      fillColor: "#d9e1c4",
      rimColor: "#fff4d0",
    },
  },
  footer: {
    id: "footer",
    position: [0, -0.15, 0.1],
    rotation: [degToRad(0), degToRad(0), degToRad(0)],
    scale: 1.12,
    floatStrength: 0.03,
    spin: 0,
    opacity: 1,
    light: {
      keyIntensity: 1.4,
      fillIntensity: 0.6,
      rimIntensity: 0.65,
      ambientIntensity: 0.7,
      exposure: 1.02,
      keyColor: "#f7d6ab",
      fillColor: "#cfdabc",
      rimColor: "#fff2ce",
    },
  },
};

const mixArrays = (a: number[], b: number[], t: number) =>
  a.map((value, index) => THREE.MathUtils.lerp(value, b[index] ?? value, t));

const blendPresets = (
  current: ScenePreset,
  next: ScenePreset,
  blend: number
): ScenePreset => ({
  id: current.id,
  position: mixArrays(
    current.position,
    next.position,
    blend
  ) as ScenePreset["position"],
  rotation: mixArrays(
    current.rotation,
    next.rotation,
    blend
  ) as ScenePreset["rotation"],
  scale: THREE.MathUtils.lerp(current.scale, next.scale, blend),
  floatStrength: THREE.MathUtils.lerp(
    current.floatStrength,
    next.floatStrength,
    blend
  ),
  spin: THREE.MathUtils.lerp(current.spin, next.spin, blend),
  opacity: THREE.MathUtils.lerp(current.opacity, next.opacity, blend),
  light: {
    keyIntensity: THREE.MathUtils.lerp(
      current.light.keyIntensity,
      next.light.keyIntensity,
      blend
    ),
    fillIntensity: THREE.MathUtils.lerp(
      current.light.fillIntensity,
      next.light.fillIntensity,
      blend
    ),
    rimIntensity: THREE.MathUtils.lerp(
      current.light.rimIntensity,
      next.light.rimIntensity,
      blend
    ),
    ambientIntensity: THREE.MathUtils.lerp(
      current.light.ambientIntensity,
      next.light.ambientIntensity,
      blend
    ),
    exposure: THREE.MathUtils.lerp(
      current.light.exposure,
      next.light.exposure,
      blend
    ),
    keyColor: new Color(current.light.keyColor)
      .lerp(new Color(next.light.keyColor), blend)
      .getStyle(),
    fillColor: new Color(current.light.fillColor)
      .lerp(new Color(next.light.fillColor), blend)
      .getStyle(),
    rimColor: new Color(current.light.rimColor)
      .lerp(new Color(next.light.rimColor), blend)
      .getStyle(),
  },
});

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isMobile;
};

const useSceneBlend = (): SceneBlendState => {
  const measurementsRef = useRef<SectionMeasurement[]>([]);
  const { scrollY } = useScroll();
  const [state, setState] = useState<SceneBlendState>({
    current: SCROLL_SCENES[0],
    next: SCROLL_SCENES[0],
    blend: 0,
  });

  const updateFromScroll = useCallback((scrollTop?: number) => {
    if (typeof window === "undefined") {
      return;
    }

    const measurements = measurementsRef.current;
    if (!measurements.length) {
      return;
    }

    const latest = typeof scrollTop === "number" ? scrollTop : window.scrollY;
    const viewportCenter = latest + window.innerHeight * 0.4;

    let baseIndex = 0;
    for (let i = 0; i < measurements.length; i++) {
      if (viewportCenter >= measurements[i].start) {
        baseIndex = i;
      }
    }

    const nextIndex = Math.min(baseIndex + 1, measurements.length - 1);
    const base = measurements[baseIndex];
    const next = measurements[nextIndex];

    const blendDistance =
      nextIndex === baseIndex
        ? window.innerHeight * 0.6
        : next.center - base.center;
    const blendValue =
      nextIndex === baseIndex
        ? 0
        : clamp01((viewportCenter - base.center) / (blendDistance || 1));

    setState((previous) => {
      if (
        previous.current === base.id &&
        previous.next === next.id &&
        Math.abs(previous.blend - blendValue) < 0.005
      ) {
        return previous;
      }

      return {
        current: base.id,
        next: next.id,
        blend: blendValue,
      };
    });
  }, []);

  const measureSections = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const entries: SectionMeasurement[] = [];
    SCROLL_SCENES.forEach((sceneId) => {
      const node = document.querySelector<HTMLElement>(
        `[data-scroll-scene="${sceneId}"]`
      );
      if (!node) {
        return;
      }
      const rect = node.getBoundingClientRect();
      const start = rect.top + window.scrollY;
      const end = rect.bottom + window.scrollY;
      entries.push({
        id: sceneId,
        start,
        end,
        center: start + rect.height / 2,
      });
    });

    if (entries.length) {
      measurementsRef.current = entries;
      updateFromScroll();
    }
  }, [updateFromScroll]);

  useEffect(() => {
    measureSections();
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("resize", measureSections);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => measureSections());
      observer.observe(document.body);
    }

    return () => {
      window.removeEventListener("resize", measureSections);
      observer?.disconnect();
    };
  }, [measureSections]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    updateFromScroll(window.scrollY);
  }, [updateFromScroll]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    updateFromScroll(latest);
  });

  return state;
};

type ProductSceneProps = {
  className?: string;
};

export function PersistentProductScene({ className }: ProductSceneProps) {
  const isMobile = useIsMobile();
  const blendState = useSceneBlend();

  const blendedPreset = useMemo(() => {
    const current = sceneScript[blendState.current];
    const next = sceneScript[blendState.next];
    return blendPresets(current, next, blendState.blend);
  }, [blendState]);

  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.15, 5.4], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <SceneRig preset={blendedPreset} isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}

type SceneRigProps = {
  preset: ScenePreset;
  isMobile: boolean;
};

const SceneRig = ({ preset, isMobile }: SceneRigProps) => {
  const pivotRef = useRef<Group>(null);
  const floatRef = useRef<Group>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const fillLightRef = useRef<PointLight>(null);
  const rimLightRef = useRef<SpotLight>(null);
  const ambientRef = useRef<AmbientLight>(null);
  const { gl } = useThree();

  const targetPosition = useMemo(
    () =>
      new Vector3(
        preset.position[0] * (isMobile ? 0.55 : 1),
        preset.position[1] + (isMobile ? -0.15 : 0),
        preset.position[2] + (isMobile ? 0.5 : 0)
      ),
    [isMobile, preset.position]
  );

  const targetRotation = useMemo<Euler>(
    () =>
      new THREE.Euler(
        preset.rotation[0],
        preset.rotation[1],
        preset.rotation[2]
      ),
    [preset.rotation]
  );

  const targetScale = useMemo(
    () => (isMobile ? preset.scale * 0.85 : preset.scale),
    [isMobile, preset.scale]
  );

  const keyColor = useMemo(
    () => new Color(preset.light.keyColor),
    [preset.light.keyColor]
  );
  const fillColor = useMemo(
    () => new Color(preset.light.fillColor),
    [preset.light.fillColor]
  );
  const rimColor = useMemo(
    () => new Color(preset.light.rimColor),
    [preset.light.rimColor]
  );

  useEffect(() => {
    gl.setClearColor(new Color("#000000"), 0);
  }, [gl]);

  useFrame((state, delta) => {
    const easing = 1 - Math.pow(0.1, delta * 60);

    if (pivotRef.current) {
      pivotRef.current.position.lerp(targetPosition, easing);
      pivotRef.current.rotation.x = THREE.MathUtils.lerp(
        pivotRef.current.rotation.x,
        targetRotation.x,
        easing
      );
      pivotRef.current.rotation.y = THREE.MathUtils.lerp(
        pivotRef.current.rotation.y,
        targetRotation.y,
        easing
      );
      pivotRef.current.rotation.z = THREE.MathUtils.lerp(
        pivotRef.current.rotation.z,
        targetRotation.z,
        easing
      );
      const currentScale = pivotRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, easing);
      pivotRef.current.scale.setScalar(nextScale);
    }

    if (floatRef.current) {
      floatRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.25) * preset.floatStrength;
      floatRef.current.rotation.y += preset.spin * delta;
    }

    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.lerp(
        keyLightRef.current.intensity,
        preset.light.keyIntensity,
        easing
      );
      keyLightRef.current.color.lerp(keyColor, easing);
    }

    if (fillLightRef.current) {
      fillLightRef.current.intensity = THREE.MathUtils.lerp(
        fillLightRef.current.intensity,
        preset.light.fillIntensity,
        easing
      );
      fillLightRef.current.color.lerp(fillColor, easing);
    }

    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        preset.light.rimIntensity,
        easing
      );
      rimLightRef.current.color.lerp(rimColor, easing);
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        preset.light.ambientIntensity,
        easing
      );
    }

    state.gl.toneMappingExposure = THREE.MathUtils.lerp(
      state.gl.toneMappingExposure,
      preset.light.exposure,
      easing
    );
  });

  return (
    <>
      <ambientLight
        ref={ambientRef}
        intensity={preset.light.ambientIntensity}
      />
      <directionalLight
        ref={keyLightRef}
        intensity={preset.light.keyIntensity}
        color={preset.light.keyColor}
        position={[3, 5, 4]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        ref={fillLightRef}
        intensity={preset.light.fillIntensity}
        color={preset.light.fillColor}
        position={[-4, 2, 2]}
      />
      <spotLight
        ref={rimLightRef}
        intensity={preset.light.rimIntensity}
        color={preset.light.rimColor}
        position={[0, 6, -1]}
        angle={0.5}
        penumbra={0.7}
      />

      <group ref={pivotRef}>
        <group ref={floatRef}>
          <ProductModel opacity={preset.opacity} />
        </group>
        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.4}
          scale={4}
          blur={2.5}
          far={2.4}
        />
      </group>

      <Environment frames={1} preset="sunset">
        <Lightformer
          form="ring"
          intensity={0.8}
          position={[0, 4, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[4, 4, 1]}
        />
      </Environment>
    </>
  );
};

type ProductModelProps = {
  opacity: number;
};

const ProductModel = ({ opacity }: ProductModelProps) => {
  const gltf = useGLTF("/assets/product.glb");
  const asset = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const materials: MeshStandardMaterial[] = [];

    cloned.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const meshMaterials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        meshMaterials.forEach((material) => {
          if (material && "opacity" in material) {
            const meshMaterial = material as MeshStandardMaterial;
            meshMaterial.transparent = true;
            materials.push(meshMaterial);
          }
        });
      }
    });

    const boundingBox = new Box3().setFromObject(cloned);
    const size = new Vector3();
    boundingBox.getSize(size);
    const center = new Vector3();
    boundingBox.getCenter(center);

    cloned.position.sub(center);
    const desiredHeight = 1;
    const uniformScale = desiredHeight / (size.y || 1);
    cloned.scale.setScalar(uniformScale);

    return { scene: cloned, materials };
  }, [gltf.scene]);

  useEffect(() => {
    asset.materials.forEach((material) => {
      material.opacity = opacity;
    });
  }, [asset.materials, opacity]);

  return <primitive object={asset.scene} />;
};

useGLTF.preload("/assets/product.glb");

/**
 * Animation overview:
 * - Sections emit data-scroll-scene markers; the hook measures their positions and turns scroll into
 *   a normalized scene index so transitions stay synced to the story beats.
 * - Each scene preset stores transform, light temperature, spin, and opacity values that are blended
 *   (easeInOut style) as users move between sections for cinematic scroll continuity.
 * - SceneRig lerps camera-relative transforms and light colors every frame, while pointer events stay
 *   disabled at the layout layer so the product feels ever-present yet never blocks interaction.
 */
