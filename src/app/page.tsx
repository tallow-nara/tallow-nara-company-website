/** @format */

import LenisWrapper from "./(components)/LenisWrapper";
import ScrollLinkedModel from "./(components)/ScrollLinkedModel";
import ScrollTriggerWrapper from "./(components)/ScrollTriggerWrapper";
import BrandSection from "./(sections)/BrandSection";
import OriginScene from "./(sections)/OriginScene";
import ProductRevealScene from "./(sections)/ProductRevealScene";
import TransformationScene from "./(sections)/TransformationScene";

export default function Home() {
  return (
    <LenisWrapper className="min-h-screen bg-linear-to-b from-[#fbf5ec] to-[#f0e4d3] font-sans text-zinc-900">
      <ScrollTriggerWrapper>
        <ScrollLinkedModel />
        <div className="flex flex-col">
          <OriginScene />
          <TransformationScene />
          <ProductRevealScene />
          <BrandSection />
        </div>
      </ScrollTriggerWrapper>
    </LenisWrapper>
  );
}
