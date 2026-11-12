import { Suspense } from "react";
import {
  getServices,
  getApprovedReviews,
  getPublishedBlogPosts,
} from "@/lib/data/store";
import Hero from "@/components/home/Hero";
import FeatureStrip from "@/components/home/FeatureStrip";
import ServicesSection from "@/components/home/ServicesSection";
import SegmentCards from "@/components/home/SegmentCards";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import ContactSection from "@/components/contact/ContactSection";
import { SectionSkeleton } from "@/components/ui/Skeleton";

export const revalidate = 60; // ISR every 60 seconds

export default async function HomePage() {
  const [services, reviews, posts] = await Promise.all([
    getServices(),
    getApprovedReviews(),
    getPublishedBlogPosts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero with cleaner cutout visual - eager loaded with high priority */}
      <Hero />

      {/* 2. Trust Feature Strip overlapping hero bottom */}
      <FeatureStrip />

      {/* 3. Services Section - server-rendered directly to eliminate CLS */}
      <ServicesSection services={services} />

      {/* 4. Customer Segments */}
      <SegmentCards />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. Client Feedback & Ratings */}
      <HomeTestimonials reviews={reviews} />

      {/* 8. Field Knowledge & Blog Guides */}
      <HomeBlogSection posts={posts} />

      {/* 9. Contact & Booking */}
      <ContactSection services={services} />
    </div>
  );
}
