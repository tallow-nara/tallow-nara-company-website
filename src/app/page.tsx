/** @format */

import { CTASection } from "@/sections/CTASection";
import { CommitmentSection } from "@/sections/CommitmentSection";
import { FooterSection } from "@/sections/FooterSection";
import { HeroSection } from "@/sections/HeroSection";
import { IngredientsImpactSection } from "@/sections/IngredientsImpactSection";
import { ProductHighlightSection } from "@/sections/ProductHighlightSection";
import { StorySection } from "@/sections/StorySection";
import { TestimonialsSection } from "@/sections/TestimonialsSection";
import { WhyTallownaraSection } from "@/sections/WhyTallownaraSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <WhyTallownaraSection />
      <IngredientsImpactSection />
      <ProductHighlightSection />
      <CommitmentSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
