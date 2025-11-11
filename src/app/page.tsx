/** @format */

import { ScrollProductNarrative } from "@/components/scroll-product";
import { CTASection } from "@/sections/CTASection";
import { CommitmentSection } from "@/sections/CommitmentSection";
import { FooterSection } from "@/sections/FooterSection";
import { HeroSection } from "@/sections/HeroSection";
import { ProductHighlightSection } from "@/sections/ProductHighlightSection";
import { TestimonialsSection } from "@/sections/TestimonialsSection";
import { WhyTallownaraSection } from "@/sections/WhyTallownaraSection";

export default function Home() {
  return (
    <ScrollProductNarrative>
      <HeroSection />
      <WhyTallownaraSection />
      <ProductHighlightSection />
      <CommitmentSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </ScrollProductNarrative>
  );
}
