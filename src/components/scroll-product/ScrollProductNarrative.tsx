/** @format */

"use client";

import type { PropsWithChildren } from "react";
import styles from "./scroll-product.module.css";
import { PersistentProductScene } from "./PersistentProductScene";

export function ScrollProductNarrative({ children }: PropsWithChildren) {
  return (
    <div className={styles.narrative}>
      <main className={styles.content}>{children}</main>
      <div className={styles.sceneLayer} aria-hidden="true">
        <PersistentProductScene className={styles.sceneCanvas} />
      </div>
    </div>
  );
}
