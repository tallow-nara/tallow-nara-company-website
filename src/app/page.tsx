/** @format */

import { ScrollProductNarrative } from "@/components/scroll-product";
import { CTASection } from "@/sections/CTASection";
import { CommitmentSection } from "@/sections/CommitmentSection";
import { FooterSection } from "@/sections/FooterSection";
import { HeroSection } from "@/sections/HeroSection";
import { IngredientsImpactSection } from "@/sections/IngredientsImpactSection";
import { ProductHighlightSection } from "@/sections/ProductHighlightSection";
import { StorySection } from "@/sections/StorySection";
import { TestimonialsSection } from "@/sections/TestimonialsSection";
import { WhyTallownaraSection } from "@/sections/WhyTallownaraSection";
import { CertificationSection } from "@/sections/CertificationSection";

export default function Home() {
  return (
    <ScrollProductNarrative>
      <HeroSection />
      <StorySection />
      <WhyTallownaraSection />
      <IngredientsImpactSection />
      <CommitmentSection />
      <ProductHighlightSection />
      <TestimonialsSection />
      <CertificationSection />
      <CTASection />
      <FooterSection />
    </ScrollProductNarrative>
  );
}
