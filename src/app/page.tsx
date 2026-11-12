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

async function ServicesSectionData() {
  const services = await getServices();
  return <ServicesSection services={services} />;
}

async function TestimonialsSectionData() {
  const reviews = await getApprovedReviews();
  return <HomeTestimonials reviews={reviews} />;
}

async function BlogSectionData() {
  const posts = await getPublishedBlogPosts();
  return <HomeBlogSection posts={posts} />;
}

async function ContactSectionData() {
  const services = await getServices();
  return <ContactSection services={services} />;
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero with Framer Motion animations & cleaner cutout visual - renders immediately */}
      <Hero />

      {/* 2. Trust Feature Strip overlapping hero bottom */}
      <FeatureStrip />

      {/* 3. Services Section - streamed with skeleton for faster LCP */}
      <Suspense fallback={<SectionSkeleton label="Loading services..." />}>
        <ServicesSectionData />
      </Suspense>

      {/* 4. Customer Segments */}
      <SegmentCards />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. Client Feedback & Ratings */}
      <Suspense fallback={<SectionSkeleton label="Loading reviews..." />}>
        <TestimonialsSectionData />
      </Suspense>

      {/* 8. Field Knowledge & Blog Guides */}
      <Suspense fallback={<SectionSkeleton label="Loading articles..." />}>
        <BlogSectionData />
      </Suspense>

      {/* 9. Contact & Booking */}
      <Suspense fallback={<SectionSkeleton label="Loading contact section..." />}>
        <ContactSectionData />
      </Suspense>
    </div>
  );
}
