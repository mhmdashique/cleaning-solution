import type { FAQ, Service, Review, BlogPost, SiteSettings, Booking } from "@/types";

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  company_name: "PLAN C Cleaning Solutions",
  tagline: "You leave it, we clean it",
  phone: "7994342372",
  phone_display: "+91 79943 42372",
  whatsapp: "917994342372",
  email: "contact@plancsolutions.in",
  address: "Thrikannapuram, Thiruvananthapuram, Kerala - 695032",
  working_hours: "Monday - Sunday: 7:00 AM - 9:00 PM",
  experience_years: "5+",
  service_areas: "Thrikannapuram, Pattom, Kowdiar, Kazhakkoottam, Technopark, Attingal, Nedumangad, Neyyattinkara, Vattiyoorkavu, Vellayambalam, Thycaud, Varkala",
};

const img = (photo: string) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=80`;

// Service catalog mirrors supabase/seed.sql. It is used as the offline
// fallback whenever Supabase is not configured or the services table is empty.
export const INITIAL_SERVICES: Service[] = [
  {
    id: "srv-1",
    slug: "full-house-deep-cleaning",
    title: "Full House Deep Cleaning",
    category: "cleaning",
    short_desc:
      "Comprehensive top-to-bottom sanitisation and deep scrubbing of your entire home in Kerala.",
    long_desc:
      "Our signature Full House Deep Cleaning service covers every corner of your home. Using professional single-disc rotary scrubbers, industrial wet & dry vacuums, and eco-friendly safe chemicals, we remove stubborn grime, yellow calcium stains, grease deposits, and concealed dust from ceilings, walls, windows, fans, floors, and cabinetry.",
    image_url: img("photo-1581578731548-c64695cc6952"),
    icon: "Sparkles",
    duration: "2–3 hours",
    is_featured: true,
    is_active: true,
    sort_order: 1,
    meta_title: "Full House Deep Cleaning in Thiruvananthapuram | PLAN C",
    meta_description:
      "Book professional full house deep cleaning in Thiruvananthapuram and across Kerala. 5+ years experience, modern equipment, eco-safe solutions.",
  },
  {
    id: "srv-2",
    slug: "normal-cleaning",
    title: "Normal & Regular House Cleaning",
    category: "cleaning",
    short_desc:
      "Routine sweeping, moping, dusting, and wiping to keep your home fresh and tidy.",
    long_desc:
      "Perfect for weekly or bi-weekly maintenance. Our trained domestic crew handles complete sweeping, damp mopping with disinfectant solutions, surface dusting, furniture wipe-down, waste disposal, and kitchen counter sanitisation.",
    image_url: img("photo-1527515637462-cff94eecc1ac"),
    icon: "Brush",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 2,
    meta_title: "Regular House Cleaning Services in Trivandrum | PLAN C",
    meta_description:
      "Reliable domestic regular house cleaning services in Thiruvananthapuram. Affordable rates, verified staff, and consistent quality.",
  },
  {
    id: "srv-3",
    slug: "kitchen-deep-cleaning",
    title: "Kitchen Deep Cleaning",
    category: "cleaning",
    short_desc:
      "Degreasing of chimneys, tiles, cabinets, stoves, and deep sanitisation of prep surfaces.",
    long_desc:
      "Kitchens in Kerala homes bear heavy oil vapor and spice residues. Our specialised kitchen deep cleaning utilizes food-grade degreasers and steam power to dissolve tough oil crusts on chimneys, exhaust fans, wall tiles, modular cabinets inside-out, granite countertops, and gas hobs.",
    image_url: img("photo-1556911220-e15b29be8c8f"),
    icon: "UtensilsCrossed",
    duration: "2–3 hours",
    is_featured: true,
    is_active: true,
    sort_order: 3,
    meta_title: "Kitchen Deep Cleaning in Thiruvananthapuram | PLAN C",
    meta_description:
      "Professional kitchen degreasing and tile cleaning in Kerala. Remove stubborn oil, soot, and bacteria with PLAN C Cleaning.",
  },
  {
    id: "srv-4",
    slug: "bathroom-deep-cleaning",
    title: "Bathroom Deep Cleaning",
    category: "cleaning",
    short_desc:
      "Intensive hard-water stain removal, grout scrubbing, and acid-free tile descaling.",
    long_desc:
      "Kerala borewell and municipal water frequently causes tough yellow salt and scale deposits on bathroom tiles and chrome fixtures. Our bathroom deep cleaning removes limescale, scum, fungal growth, and discolours grout without damaging ceramic glazes.",
    image_url: img("photo-1584622650111-993a426fbf0a"),
    icon: "Bath",
    duration: "2–3 hours",
    is_featured: true,
    is_active: true,
    sort_order: 4,
    meta_title: "Bathroom Deep Cleaning in Trivandrum | PLAN C",
    meta_description:
      "Eradicate hard water stains and germs with our bathroom deep cleaning services in Thiruvananthapuram. Safe sanitisation guaranteed.",
  },
  {
    id: "srv-5",
    slug: "bathroom-steam-cleaning",
    title: "Bathroom Steam Sanitisation",
    category: "cleaning",
    short_desc:
      "140°C chemical-free high-pressure steam cleaning for 99.9% germ and mold eradication.",
    long_desc:
      "High humidity in Kerala creates black mould and hidden bacteria in silicone joints and crevices. Our high-pressure thermal steam cleaner penetrates microscopic tile pores, killing allergens and bacterial spores without harsh chemical fumes.",
    image_url: img("photo-1507652313519-d4e9174996dd"),
    icon: "Flame",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 5,
    meta_title: "Bathroom Steam Cleaning Services Kerala | PLAN C",
    meta_description:
      "Chemical-free high-temperature steam sanitisation for residential and commercial washrooms in Trivandrum.",
  },
  {
    id: "srv-6",
    slug: "floor-scrubbing-polishing",
    title: "Floor Scrubbing & Polishing",
    category: "cleaning",
    short_desc:
      "Single-disc mechanized scrubbing for vitrified tiles, granite, Kota stone, and marble.",
    long_desc:
      "Over time, foot traffic and humidity dull floor surfaces and darken grout lines. Our rotary single-disc floor scrubbers paired with neutral pH floor conditioners lift embedded soil, strip grime, and restore natural floor sheen.",
    image_url: img("photo-1628177142898-93e36e4e3a50"),
    icon: "Layers",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 6,
    meta_title: "Mechanized Floor Scrubbing & Polishing Trivandrum | PLAN C",
    meta_description:
      "Industrial-grade rotary floor scrubbing and deep tile restoration in Thiruvananthapuram, Kerala.",
  },
  {
    id: "srv-7",
    slug: "water-tank-cleaning",
    title: "Water Tank & Sump Cleaning",
    category: "cleaning",
    short_desc:
      "6-stage mechanized cleaning and UV disinfection for overhead tanks and underground sumps.",
    long_desc:
      "Ensure clean, contamination-free drinking water. Our certified procedure includes dewatering, sludge extraction with high-power pumps, high-pressure rotary jet cleaning, vacuum suction, anti-bacterial spray, and UV sterilisation.",
    image_url: img("photo-1585314062340-f1a5a7c9328d"),
    icon: "Droplets",
    duration: "2–3 hours",
    is_featured: true,
    is_active: true,
    sort_order: 7,
    meta_title: "Water Tank & Sump Cleaning in Thiruvananthapuram | PLAN C",
    meta_description:
      "6-step hygienic water tank and underground sump cleaning in Kerala. Safe UV disinfection and certified process.",
  },
  {
    id: "srv-8",
    slug: "sofa-mattress-carpet-shampooing",
    title: "Sofa, Mattress & Carpet Shampooing",
    category: "cleaning",
    short_desc:
      "Deep injection-extraction foam wash that removes stains, dust mites, and foul odors.",
    long_desc:
      "Kerala humidity promotes dust mites and mold inside fabric upholstery. Our German injection-extraction vacuum pumps deep shampoo foam into couches, mattresses, and woolen rugs, extracting pet dander, beverage stains, and allergens.",
    image_url: img("photo-1555041469-a586c61ea9bc"),
    icon: "Armchair",
    duration: "2–3 hours",
    is_featured: true,
    is_active: true,
    sort_order: 8,
    meta_title: "Upholstery & Sofa Shampooing in Trivandrum | PLAN C",
    meta_description:
      "Onsite fabric sofa, mattress sanitisation, and carpet shampooing in Thiruvananthapuram. Quick dry technology.",
  },
  {
    id: "srv-9",
    slug: "outdoor-interlock-cleaning",
    title: "Outdoor & Interlock Paver Cleaning",
    category: "cleaning",
    short_desc:
      "High-PSI pressure washing to strip moss, black fungal slime, and mud from driveways.",
    long_desc:
      "Monsoon rains in Kerala coat interlock driveways, compound walls, and porch tiles with slippery green algae and dark fungus. Our 200+ BAR pressure washers blast away years of grime without damaging paving stones.",
    image_url: img("photo-1590381105924-c72589b9ef3f"),
    icon: "TreePine",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 9,
    meta_title: "Interlock & Outdoor Pressure Washing Trivandrum | PLAN C",
    meta_description:
      "Restore slippery interlock pavers and exterior pathways with high-pressure water blasting across Thiruvananthapuram.",
  },
  {
    id: "srv-10",
    slug: "glass-window-cleaning",
    title: "Glass & Facade Cleaning",
    category: "cleaning",
    short_desc:
      "Streak-free window, glass railing, and structural glazing cleaning with telescopic kits.",
    long_desc:
      "Crystal clear views with zero smudges. We use pure-water telescopic poles and streak-free squeegees for architectural glass, French doors, glass balconies, and solar panels.",
    image_url: img("photo-1527515637462-cff94eecc1ac"),
    icon: "Maximize2",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 10,
    meta_title: "Glass & Window Cleaning Services Kerala | PLAN C",
    meta_description:
      "Professional streak-free window, sliding glass, and facade cleaning for homes and commercial complexes in Kerala.",
  },
  {
    id: "srv-11",
    slug: "general-pest-control",
    title: "General Pest Control",
    category: "pest_control",
    short_desc:
      "Comprehensive indoor defense against crawling and flying insects with government-approved odorless sprays.",
    long_desc:
      "Protect your family from cockroaches, silverfish, ants, and spiders. Our integrated pest management (IPM) treatment uses odorless Bayer/Syngenta formulations safe for infants and senior citizens.",
    image_url: img("photo-1622560480605-d83c853bc5c3"),
    icon: "ShieldCheck",
    duration: "2–3 hours",
    is_featured: true,
    is_active: true,
    sort_order: 11,
    meta_title: "General Pest Control Services in Thiruvananthapuram | PLAN C",
    meta_description:
      "Certified odorless pest control solutions for residential and commercial premises in Trivandrum, Kerala.",
  },
  {
    id: "srv-12",
    slug: "anti-termite-treatment",
    title: "Anti-Termite Treatment (Pre & Post)",
    category: "pest_control",
    short_desc:
      "Subterranean termite defense with chemical barrier drilling and long-term warranties.",
    long_desc:
      "Kerala red soil and wet climate are hotbeds for destructive white ants (termites). We drill 12mm holes along inner perimeter walls, inject active termiticide barriers, and seal holes seamlessly, providing multi-year protection certificates.",
    image_url: img("photo-1600585154340-be6161a56a0c"),
    icon: "Bug",
    duration: "2–3 hours",
    is_featured: true,
    is_active: true,
    sort_order: 12,
    meta_title: "Termite Control & Anti-Termite Treatment Trivandrum | PLAN C",
    meta_description:
      "Long-lasting subterranean termite barrier treatments with warranty in Thiruvananthapuram. Free site inspection.",
  },
  {
    id: "srv-13",
    slug: "cockroach-gel-treatment",
    title: "Cockroach Gel & Herbal Treatment",
    category: "pest_control",
    short_desc:
      "Precision target gel baiting inside modular drawers and motor housings without emptying utensils.",
    long_desc:
      "Eliminate German and American cockroach colonies without emptying kitchen utensils or dealing with chemical stench. Our micro-drop fipronil and herbal bait gels deliver complete nest extinction within 7 days.",
    image_url: img("photo-1584622650111-993a426fbf0a"),
    icon: "Crosshair",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 13,
    meta_title: "Cockroach Control in Thiruvananthapuram | PLAN C",
    meta_description:
      "Odorless cockroach gel baiting for homes and commercial kitchens in Trivandrum. No need to empty cupboards.",
  },
  {
    id: "srv-14",
    slug: "bed-bugs-treatment",
    title: "Bed Bugs Eradication & Steam Wash",
    category: "pest_control",
    short_desc:
      "Two-stage intensive contact and residual knockdown plus high-heat mattress steaming.",
    long_desc:
      "Bed bug infestations disrupt sleep and cause distressing bites. We perform thorough thermal steaming combined with safe micro-encapsulated sprays in bed frames, headboards, mattress seams, and switchboard cavities.",
    image_url: img("photo-1505693416388-ac5ce068fe85"),
    icon: "AlertCircle",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 14,
    meta_title: "Bed Bug Treatment in Thiruvananthapuram | PLAN C",
    meta_description:
      "Guaranteed bed bug eradication with dual visit treatments and mattress steaming in Kerala.",
  },
  {
    id: "srv-15",
    slug: "rodent-control",
    title: "Rodent & Rat Control",
    category: "pest_control",
    short_desc:
      "Tamper-proof bait stations, glue traps, and entry-point rodent exclusion.",
    long_desc:
      "Prevent property destruction and leptospirosis. We deploy secure rat bait boxes, heavy-duty glue boards in false ceilings, and offer entry hole sealing consultation for homes, restaurants, and IT offices in Technopark.",
    image_url: img("photo-1517646287270-a5a9ca602e5c"),
    icon: "Target",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 15,
    meta_title: "Rodent Control & Rat Extermination Trivandrum | PLAN C",
    meta_description:
      "Professional rodent control and false ceiling baiting for homes and offices in Thiruvananthapuram.",
  },
  {
    id: "srv-16",
    slug: "mosquito-control-fogging",
    title: "Mosquito Control & Thermal Fogging",
    category: "pest_control",
    short_desc:
      "Larvicidal water treatment and cold ULV misting for yards, gardens, and drains.",
    long_desc:
      "Combat dengue and mosquito nuisances. We treat stagnant drain outlets with biological larvicides and perform outdoor thermal fogging for large residential plots, schools, and apartment compounds.",
    image_url: img("photo-1500382017468-9049fed747ef"),
    icon: "Wind",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 16,
    meta_title: "Mosquito Control & Yard Fogging Services Kerala | PLAN C",
    meta_description:
      "Effective mosquito control, anti-larval treatment, and garden misting in Thiruvananthapuram.",
  },
  {
    id: "srv-17",
    slug: "office-commercial-cleaning",
    title: "Office & Commercial Deep Cleaning",
    category: "commercial",
    short_desc:
      "Tailored housekeeping and deep sanitisation for IT offices, clinics, and retail stores.",
    long_desc:
      "Keep your workplace pristine and productive. Includes workstation dusting, keyboard sanitisation, conference room vacuuming, pantry degreasing, and restroom sanitisation during off-peak hours.",
    image_url: img("photo-1497366216548-37526070297c"),
    icon: "Building2",
    duration: "2–3 hours",
    is_featured: true,
    is_active: true,
    sort_order: 17,
    meta_title: "Office & Commercial Cleaning Services Trivandrum | PLAN C",
    meta_description:
      "Trusted commercial housekeeping and deep office cleaning in Technopark and Thiruvananthapuram.",
  },
  {
    id: "srv-18",
    slug: "garden-and-lawn-cleaning",
    title: "Garden & Lawn Clearing",
    category: "specialised",
    short_desc:
      "Weed removal, dead foliage clearing, perimeter trimming, and organic waste disposal.",
    long_desc:
      "Kerala backyards quickly overgrow during tropical rains. We clear unmanageable weeds, prune overgrown hedges, sweep fallen coconut leaves, and cart away yard debris for clean open spaces.",
    image_url: img("photo-1557429287-b2e26467fc2b"),
    icon: "Sprout",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 18,
    meta_title: "Garden Cleaning & Yard Clearing Trivandrum | PLAN C",
    meta_description:
      "Comprehensive yard cleaning, lawn trimming, and garden debris disposal across Thiruvananthapuram.",
  },
  {
    id: "srv-19",
    slug: "post-construction-cleaning",
    title: "Post-Construction & Renovation Cleaning",
    category: "specialised",
    short_desc:
      "Removal of cement splatter, paint drips, drywall dust, and tape residue from newly built properties.",
    long_desc:
      "Handover-ready perfection. We remove stubborn cement lumps, paint smears from window panes, adhesive residues, and tile grout haze so your newly built house or villa is spotless for housewarming.",
    image_url: img("photo-1504307651254-35680f356dfd"),
    icon: "Wrench",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 19,
    meta_title: "Post Construction Cleaning in Kerala | PLAN C",
    meta_description:
      "Specialised post renovation and newly built house handover cleaning in Thiruvananthapuram.",
  },
  {
    id: "srv-20",
    slug: "move-in-move-out-cleaning",
    title: "Move-In / Move-Out Cleaning",
    category: "cleaning",
    short_desc:
      "Thorough turnover cleaning for landlords, tenants, and real estate agencies.",
    long_desc:
      "Moving into a new home or leaving an apartment? Ensure you get your security deposit back or step into a 100% disinfected home with our thorough move-in/move-out package.",
    image_url: img("photo-1600585154340-be6161a56a0c"),
    icon: "Truck",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 20,
    meta_title: "Move-In & Move-Out House Cleaning Trivandrum | PLAN C",
    meta_description:
      "Detailed pre-move and tenancy turnover cleaning services in Thiruvananthapuram.",
  },
  {
    id: "srv-21",
    slug: "chimney-exhaust-cleaning",
    title: "Kitchen Chimney & Exhaust Cleaning",
    category: "specialised",
    short_desc:
      "Baffle filter soaking, motor blower degreasing, and carbon duct clearing.",
    long_desc:
      "Heavy frying and traditional Kerala cooking clog chimney filters quickly. We dismantle filters, submerge them in heavy-duty oil-dissolving baths, and clean exhaust blades to restore maximum suction.",
    image_url: img("photo-1556911220-e15b29be8c8f"),
    icon: "Fan",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 21,
    meta_title: "Kitchen Chimney Cleaning Services Trivandrum | PLAN C",
    meta_description:
      "Expert electric chimney and exhaust blower degreasing across Thiruvananthapuram.",
  },
  {
    id: "srv-22",
    slug: "marble-granite-polishing",
    title: "Marble & Granite Polishing",
    category: "specialised",
    short_desc:
      "Diamond pad hone grinding, crystallization, and sealant protection for natural stone floors.",
    long_desc:
      "Eliminate scratches and restore mirror-like gloss on Italian marble, Indian marble, and granite with high-speed crystallization chemicals and diamond disc pads.",
    image_url: img("photo-1600565193348-f74bd3c7ccdf"),
    icon: "Gem",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 22,
    meta_title: "Marble & Granite Floor Polishing Kerala | PLAN C",
    meta_description:
      "Premium diamond crystallization and stone restoration in Thiruvananthapuram.",
  },
  {
    id: "srv-23",
    slug: "swimming-pool-cleaning",
    title: "Swimming Pool Cleaning & Maintenance",
    category: "specialised",
    short_desc:
      "Vacuuming bottom debris, balancing chlorine/pH levels, and filter backwashing.",
    long_desc:
      "Keep your private villa pool or club swimming pool sparkling and hygienic. Includes algae scrubbing, leaf netting, sand filter backwashing, and precise chemical balancing.",
    image_url: img("photo-1576013551627-0cc20b96c2a7"),
    icon: "Waves",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 23,
    meta_title: "Swimming Pool Cleaning Services Trivandrum | PLAN C",
    meta_description:
      "Professional pool maintenance and chemical balancing for villas and resorts in Kerala.",
  },
  {
    id: "srv-24",
    slug: "annual-maintenance-contract",
    title: "Annual Maintenance Contracts (AMC)",
    category: "commercial",
    short_desc:
      "Scheduled quarterly or monthly cleaning and pest control maintenance packages for residences and businesses.",
    long_desc:
      "Peace of mind all year round. Custom AMC schedules cover scheduled deep cleans, periodic pest repellence, water tank sterilisation, and priority emergency response at discounted corporate rates.",
    image_url: img("photo-1450133064473-71024230f91b"),
    icon: "CalendarCheck",
    duration: "2–3 hours",
    is_featured: false,
    is_active: true,
    sort_order: 24,
    meta_title: "Annual Cleaning & Pest AMC Contracts Kerala | PLAN C",
    meta_description:
      "Year-round hassle-free cleaning and pest maintenance packages for homes, villas, and commercial establishments.",
  },
];

// Reviews, articles, and bookings start empty.
// Real records are created through the admin dashboard or the public forms.
export const INITIAL_REVIEWS: Review[] = [];
export const INITIAL_BLOG_POSTS: BlogPost[] = [];
export const INITIAL_BOOKINGS: Booking[] = [];

// FAQ data for initial visitors
export const INITIAL_FAQS: FAQ[] = [
  {
    id: "faq-1",
    service_id: "srv-1",
    question: "How do I book a service?",
    answer: "Booking a service is simple! You can book online through our website, call us at 7994342372, or message us on WhatsApp. Just let us know which service you need, your preferred date and time, your location, and any specific instructions for access.",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "faq-2",
    service_id: "srv-1",
    question: "What are your payment options?",
    answer: "We accept various payment methods including cash, bank cards, and credit cards. Payment options available include standard rate pricing or monthly subscription plans for regular cleaning services. You can pay at the time of service or set up automatic recurring payments.",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "faq-3",
    service_id: "srv-1",
    question: "Can I change or reschedule my booking?",
    answer: "Yes! You can reschedule or change your booking up to 2 hours before the scheduled service time without penalty. Use our online tracking system with your booking ID and phone number, or contact us directly to make any adjustments to your appointment.",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "faq-4",
    service_id: "srv-1",
    question: "Are your cleaning staff vetted and insured?",
    answer: "Absolutely! All our cleaning specialists undergo thorough background checks, skills testing, and are fully insured. We maintain complete confidentiality and provide professional references for your peace of mind. Our team is trained in safety protocols and quality standards.",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "faq-5",
    service_id: "srv-1",
    question: "What products do you use for cleaning?",
    answer: "We use eco-friendly, non-toxic cleaning products that are safe for children, pets, and the environment. Our cleaning solutions are hypoallergenic and specifically formulated to remove dirt, grime, and bacteria without leaving harmful residues. We also have specialized products for different surface types.",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "faq-6",
    service_id: "srv-1",
    question: "What guarantees do you offer?",
    answer: "We stand behind our work with a 100% satisfaction guarantee. If you're not completely happy with our service within 24 hours of completion, we'll return to make it right at no additional cost. This includes re-cleaning any areas that don't meet our quality standards.",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "faq-7",
    service_id: "srv-1",
    question: "What if I have special requirements or have a pet in the house?",
    answer: "We welcome all special requests! Just let us know about pets, allergies, or any specific concerns during your booking. We have pet-safe products, allergy-friendly options, and special handling procedures for delicate items, elderly care, or accessibility needs.",
    created_at: "2025-01-01T00:00:00Z",
  },
];
