import { 
  getServices, 
  getApprovedReviews, 
  getPublishedBlogPosts 
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

export const revalidate = 60; // ISR every 60 seconds

export default async function HomePage() {
  const [services, reviews, blogPosts] = await Promise.all([
    getServices(),
    getApprovedReviews(),
    getPublishedBlogPosts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero with Framer Motion animations & cleaner cutout visual */}
      <Hero />

      {/* 2. Trust Feature Strip overlapping hero bottom */}
      <FeatureStrip />

      {/* 3. Services Section with category tabs (all services are available to the filters) */}
      <ServicesSection services={services} />

      {/* 4. Customer Segments (Home, Office, Garden) */}
      <SegmentCards />

      {/* 5. Why Choose Us (The PLAN C Advantage) */}
      <WhyChooseUs />

      {/* 6. How It Works (3 Steps) */}
      <HowItWorks />

      {/* 7. Client Feedback & Ratings */}
      <HomeTestimonials reviews={reviews} />

      {/* 8. Field Knowledge & Blog Guides */}
      <HomeBlogSection posts={blogPosts} />

      {/* 9. Contact & Booking (same as /contact page) */}
      <ContactSection services={services} />
    </div>
  );
}
