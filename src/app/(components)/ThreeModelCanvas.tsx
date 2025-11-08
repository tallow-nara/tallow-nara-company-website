'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

type ThreeModelCanvasProps = {
  modelPath: string;
  className?: string;
  cameraPosition?: Vec3;
  cameraFov?: number;
  cameraNear?: number;
  cameraFar?: number;
  modelScale?: number | Vec3;
  modelPosition?: Vec3;
  modelRotation?: Vec3;
  autoRotateSpeed?: number;
};

const parseVec3Key = (value: string): Vec3 =>
  value.split(",").map((part) => Number(part)) as Vec3;

const parseScaleKey = (value: number | string): Vec3 => {
  if (typeof value === "number") {
    return [value, value, value];
  }
  return parseVec3Key(value);
};

const ThreeModelCanvas = ({
  modelPath,
  className = "",
  cameraPosition = [0.2, 0.4, 2.2],
  cameraFov = 35,
  cameraNear = 0.1,
  cameraFar = 100,
  modelScale = 1,
  modelPosition = [0, 0, 0],
  modelRotation = [0, 0, 0],
  autoRotateSpeed = 0.003,
}: ThreeModelCanvasProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scaleKey = Array.isArray(modelScale)
    ? modelScale.join(",")
    : modelScale;
  const cameraPosKey = cameraPosition.join(",");
  const modelPosKey = modelPosition.join(",");
  const modelRotKey = modelRotation.join(",");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      cameraFov,
      container.clientWidth / (container.clientHeight || 1),
      cameraNear,
      cameraFar,
    );
    const cameraVec = parseVec3Key(cameraPosKey);
    camera.position.set(cameraVec[0], cameraVec[1], cameraVec[2]);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcabfa8, 0.8);
    hemiLight.position.set(0, 2, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf7d9a8, 0.6);
    fillLight.position.set(-3, 2, -4);
    scene.add(fillLight);

    let model: THREE.Object3D | null = null;
    let animationFrameId = 0;

    const loadModel = async () => {
      try {
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        if (disposed) {
          return;
        }

        const loader = new GLTFLoader();
        loader.load(
          modelPath,
          (gltf) => {
            if (disposed) {
              return;
            }

            model = gltf.scene;
            model.traverse((object) => {
              object.castShadow = true;
              object.receiveShadow = true;
            });

            const scaleVec = parseScaleKey(scaleKey);
            const modelPosVec = parseVec3Key(modelPosKey);
            const modelRotVec = parseVec3Key(modelRotKey);
            model.scale.set(scaleVec[0], scaleVec[1], scaleVec[2]);
            model.position.set(
              modelPosVec[0],
              modelPosVec[1],
              modelPosVec[2],
            );
            model.rotation.set(
              modelRotVec[0],
              modelRotVec[1],
              modelRotVec[2],
            );

            scene.add(model);
          },
          undefined,
          (error) => {
            if (!disposed) {
              console.error("Gagal memuat model GLB:", error);
            }
          },
        );
      } catch (error) {
        if (!disposed) {
          console.error("Tidak dapat memuat GLTFLoader:", error);
        }
      }
    };

    loadModel();

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);
      if (model && autoRotateSpeed !== 0) {
        model.rotation.y += autoRotateSpeed;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) {
        return;
      }

      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) {
        return;
      }
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      if (model) {
        scene.remove(model);
      }

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    modelPath,
    autoRotateSpeed,
    cameraFov,
    cameraNear,
    cameraFar,
    cameraPosKey,
    modelPosKey,
    modelRotKey,
    scaleKey,
  ]);

  return <div ref={containerRef} className={className} />;
};

export default ThreeModelCanvas;
