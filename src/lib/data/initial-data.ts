import { Service, Review, BlogPost, SiteSettings, Booking } from "@/types";

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

export const INITIAL_SERVICES: Service[] = [
  // 1. Cleaning Services (From company creatives + additions)
  {
    id: "srv-1",
    slug: "full-house-deep-cleaning",
    title: "Full House Deep Cleaning",
    category: "cleaning",
    short_desc: "Comprehensive top-to-bottom sanitisation, scrubbing, and degreasing of your entire home in Kerala.",
    long_desc: "Our signature Full House Deep Cleaning service is engineered for Kerala residences facing high humidity, red laterite soil dust, and dampness. Using industrial single-disc rotary scrubbers, German injection-extraction vacuums, and eco-friendly safe chemicals, our verified crew scrubs ceilings, ceiling fans, switchboards, window tracks, kitchen grease, bathroom tiles, and living room floors to factory-grade perfection.",
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    icon: "Sparkles",
    is_featured: true,
    sort_order: 1,
    meta_title: "Full House Deep Cleaning in Thiruvananthapuram | PLAN C",
    meta_description: "Book professional full house deep cleaning in Thiruvananthapuram and across Kerala. Modern equipment, verified staff, and 100% satisfaction guaranteed.",
  },
  {
    id: "srv-2",
    slug: "normal-cleaning",
    title: "Normal & Regular House Cleaning",
    category: "cleaning",
    short_desc: "Routine sweeping, mopping, dusting, and wiping to maintain daily cleanliness and freshness.",
    long_desc: "Tailored for busy professionals and families in Trivandrum. Our regular cleaning package covers thorough floor sweeping, damp disinfectant mopping, dusting of tables and entertainment units, window sill wipe-down, garbage clearing, and bathroom touch-up sanitisation.",
    image_url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
    icon: "Brush",
    is_featured: false,
    sort_order: 2,
    meta_title: "Regular House Cleaning Services in Trivandrum | PLAN C",
    meta_description: "Reliable domestic regular house cleaning services in Thiruvananthapuram. Affordable rates, verified staff, and consistent quality.",
  },
  {
    id: "srv-3",
    slug: "kitchen-cleaning",
    title: "Kitchen Deep Cleaning",
    category: "cleaning",
    short_desc: "Complete degreasing of chimneys, tiles, cabinets inside-out, and sanitisation of cooking surfaces.",
    long_desc: "Traditional Kerala cooking involves mustard splutters, hot coconut oil fumes, and heavy spices that settle into stubborn yellow-brown grease films on chimneys, cabinet laminates, and wall tiles. Our kitchen deep clean utilizes industrial food-safe bio-degreasers and steam lances to dissolve oily carbon deposits, leaving kitchen cabinets, sinks, and burners impeccably clean.",
    image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    icon: "UtensilsCrossed",
    is_featured: true,
    sort_order: 3,
    meta_title: "Kitchen Deep Cleaning in Thiruvananthapuram | PLAN C",
    meta_description: "Professional kitchen degreasing, chimney scrubbing, and cabinet sanitisation in Kerala. Clean kitchens make healthy homes.",
  },
  {
    id: "srv-4",
    slug: "bathroom-cleaning",
    title: "Bathroom Deep Cleaning",
    category: "cleaning",
    short_desc: "Intensive hard-water scale descaling, tile scrubbing, and fixture polishing with zero harsh fumes.",
    long_desc: "Kerala borewell and municipality water frequently causes stubborn whitish calcium rings and iron scaling on ceramic tiles, glass shower screens, and chrome taps. Our deep bathroom clean uses non-corrosive descaling formulas that safely remove limescale, soap scum, and yellow grout grime without damaging glaze or releasing toxic chlorine vapors.",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    icon: "Bath",
    is_featured: true,
    sort_order: 4,
    meta_title: "Bathroom Deep Cleaning in Trivandrum | PLAN C",
    meta_description: "Say goodbye to hard water stains and slippery bathroom scum. Certified bathroom sanitisation in Thiruvananthapuram.",
  },
  {
    id: "srv-5",
    slug: "bathroom-steam-cleaning",
    title: "Bathroom Steam Cleaning",
    category: "cleaning",
    short_desc: "140°C thermal steam sanitisation that eradicates 99.9% of bacteria, mildew, and black mold spores.",
    long_desc: "High humidity in coastal Kerala fosters black fungal spores and bacterial colonies in tile junctions and silicone seals. Our high-pressure thermal steam cleaner penetrates deep into microscopic tile crevices, sterilizing commodes, drains, and corners with pure heat and no aggressive chemicals.",
    image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    icon: "Flame",
    is_featured: false,
    sort_order: 5,
    meta_title: "Bathroom Steam Sanitisation Kerala | PLAN C",
    meta_description: "Chemical-free high-temperature steam cleaning for residential and commercial bathrooms across Trivandrum.",
  },
  {
    id: "srv-6",
    slug: "floor-scrubbing",
    title: "Mechanized Floor Scrubbing",
    category: "cleaning",
    short_desc: "Single-disc rotary scrubbing and buffing for vitrified tiles, granite, Kota stone, and marble.",
    long_desc: "Daily mopping often pushes dirty water into grout lines, causing tiles to lose their natural luster. Our high-RPM rotary floor scrubbing machines with abrasive brush pads strip deeply embedded grime and old wax build-up, restoring the original sheen of your floors.",
    image_url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1200&q=80",
    icon: "Layers",
    is_featured: false,
    sort_order: 6,
    meta_title: "Mechanized Floor Scrubbing & Polishing Trivandrum | PLAN C",
    meta_description: "Restore your dull tile and stone floors with industrial single-disc floor scrubbing machines in Thiruvananthapuram.",
  },
  {
    id: "srv-7",
    slug: "water-tank-cleaning",
    title: "Water Tank & Sump Cleaning",
    category: "cleaning",
    short_desc: "6-stage hygienic cleaning and UV radiation disinfection for overhead tanks and sumps.",
    long_desc: "Drinking water safety is essential. Our certified 6-stage mechanized water tank cleaning includes automatic dewatering, bottom sludge extraction with high-suction slurry pumps, high-pressure rotary water jet washing, vacuum residue removal, anti-bacterial spraying, and final UV lamp radiation sterilization.",
    image_url: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1200&q=80",
    icon: "Droplets",
    is_featured: true,
    sort_order: 7,
    meta_title: "Water Tank & Sump Cleaning in Thiruvananthapuram | PLAN C",
    meta_description: "Pure, safe drinking water with our 6-step mechanized tank cleaning and UV sterilisation across Trivandrum.",
  },
  {
    id: "srv-8",
    slug: "sofa-mattress-carpet-shampooing",
    title: "Sofa, Mattress & Carpet Shampooing",
    category: "cleaning",
    short_desc: "Deep injection-extraction foam wash removing deep-seated sweat stains, dust mites, and odors.",
    long_desc: "Kerala humidity traps moisture and body oils inside upholstery, creating musty odors and dust mite allergies. Our high-power injection-extraction extraction system injects deep fabric shampoo and vacuums out 90% of moisture immediately, leaving furniture clean and drying within 3 to 4 hours.",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    icon: "Armchair",
    is_featured: true,
    sort_order: 8,
    meta_title: "Upholstery & Sofa Shampooing in Trivandrum | PLAN C",
    meta_description: "Onsite fabric sofa, mattress sanitisation, and carpet shampooing in Thiruvananthapuram. Quick dry technology.",
  },
  {
    id: "srv-9",
    slug: "outdoor-cleaning",
    title: "Outdoor & Interlock Cleaning",
    category: "cleaning",
    short_desc: "High-PSI pressure washing to strip moss, black fungal slime, and mud from driveways.",
    long_desc: "Monsoon rains in Kerala coat interlock driveways, compound walls, and porch tiles with slippery green algae and dark fungus. Our 200+ BAR pressure washers blast away years of grime without damaging paving stones or mortar joints.",
    image_url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    icon: "TreePine",
    is_featured: false,
    sort_order: 9,
    meta_title: "Interlock & Outdoor Pressure Washing Trivandrum | PLAN C",
    meta_description: "Eradicate slippery moss and dirt from driveways, compound walls, and terraces with high-PSI jet washing.",
  },
  {
    id: "srv-10",
    slug: "glass-cleaning",
    title: "Glass & Window Cleaning",
    category: "cleaning",
    short_desc: "Streak-free cleaning for architectural glass panels, sliding windows, and facade railings.",
    long_desc: "Enjoy pristine outdoor views. We use streak-free demineralized water solutions, micro-squeegees, and safety extension poles to eliminate water spots, fingerprints, and pollution residue from residential windows and commercial facades.",
    image_url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
    icon: "Maximize2",
    is_featured: false,
    sort_order: 10,
    meta_title: "Glass & Window Cleaning Services Kerala | PLAN C",
    meta_description: "Professional streak-free window, sliding glass, and facade cleaning for homes and commercial complexes in Kerala.",
  },
  {
    id: "srv-11",
    slug: "interlock-cleaning",
    title: "Interlock Paver Restoration",
    category: "cleaning",
    short_desc: "Deep pressure descaling and anti-fungal treatment for interlock pavers and car porches.",
    long_desc: "Over time, sand joints wash out and moss turns interlock stones pitch black. Our deep restoration removes weed roots and fungal biofilms, restoring vibrant color and traction to your courtyard.",
    image_url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    icon: "Layers",
    is_featured: false,
    sort_order: 11,
    meta_title: "Interlock Paver Restoration Trivandrum | PLAN C",
    meta_description: "Professional high-pressure interlock cleaning, moss removal, and anti-fungal washing in Thiruvananthapuram.",
  },

  // 2. Pest Control Services (From company creatives + additions)
  {
    id: "srv-12",
    slug: "general-pest-control",
    title: "General Pest Control",
    category: "pest_control",
    short_desc: "Integrated pest management against cockroaches, ants, spiders, and silverfish.",
    long_desc: "Guaranteed protection for your family. We use safe, odorless, WHO-approved formulations from leading agrochemical manufacturers (Bayer/Syngenta) that eliminate common indoor pests without requiring family members or pets to evacuate the premises.",
    image_url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=80",
    icon: "ShieldCheck",
    is_featured: true,
    sort_order: 12,
    meta_title: "General Pest Control Services in Thiruvananthapuram | PLAN C",
    meta_description: "Safe, odorless pest control solutions for residential and commercial premises in Trivandrum, Kerala.",
  },
  {
    id: "srv-13",
    slug: "anti-termite-control",
    title: "Anti-Termite Treatment (Pre & Post)",
    category: "pest_control",
    short_desc: "Subterranean termite defense with precision barrier drilling and multi-year warranties.",
    long_desc: "Subterranean white ants quietly hollow out door frames, modular wardrobes, and book collections in Kerala's moist red soil. Our certified technicians drill 12mm holes at 30cm intervals along interior walls, inject active termiticide barriers, and seal the holes cleanly to protect your investment for years.",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    icon: "Bug",
    is_featured: true,
    sort_order: 13,
    meta_title: "Anti-Termite Treatment in Trivandrum | PLAN C Pest Control",
    meta_description: "Long-lasting anti-termite barrier treatments with written warranty in Thiruvananthapuram. Free site inspection.",
  },
  {
    id: "srv-14",
    slug: "cockroach-control",
    title: "Cockroach Gel Baiting Treatment",
    category: "pest_control",
    short_desc: "Odorless herbal & fipronil gel baiting targeting nest eradication with no need to empty utensils.",
    long_desc: "No need to pack your spices and crockery. Our cockroach management applies micro-dots of palatable fipronil bait gel in concealed electrical hinges, refrigerator compressors, and cabinet undersides. Foraging cockroaches carry the bait back to the harborage, eradicating the entire colony within 7 days.",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    icon: "Crosshair",
    is_featured: false,
    sort_order: 14,
    meta_title: "Cockroach Control in Thiruvananthapuram | PLAN C",
    meta_description: "Odorless cockroach gel baiting for homes and commercial kitchens in Trivandrum. Complete nest eradication.",
  },
  {
    id: "srv-15",
    slug: "bed-bugs-control",
    title: "Bed Bugs Eradication & Steam Wash",
    category: "pest_control",
    short_desc: "Two-stage intensive knockdown spray plus high-temperature mattress steaming.",
    long_desc: "Bed bug infestations disrupt sleep and cause intense allergic bites. Our two-stage protocol attacks both living adults and hidden eggs using 140°C thermal steam combined with micro-encapsulated residual formulations across bed frames, mattress seams, and switchboard cavities.",
    image_url: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?auto=format&fit=crop&w=1200&q=80",
    icon: "AlertCircle",
    is_featured: false,
    sort_order: 15,
    meta_title: "Bed Bug Treatment in Thiruvananthapuram | PLAN C",
    meta_description: "Guaranteed bed bug eradication with dual visit treatments and mattress steaming in Kerala.",
  },
  {
    id: "srv-16",
    slug: "ticks-control",
    title: "Ticks & Fleas Control",
    category: "pest_control",
    short_desc: "Pet-safe tick extermination and yard perimeter spraying to protect family and furry companions.",
    long_desc: "Ticks and fleas carry severe blood-borne pathogens affecting pets and humans. We perform dual internal and external yard treatments with pet-compatible synthetic pyrethroids, clearing baseboards, pet resting areas, and garden grass.",
    image_url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80",
    icon: "ShieldAlert",
    is_featured: false,
    sort_order: 16,
    meta_title: "Ticks & Fleas Pest Control Trivandrum | PLAN C",
    meta_description: "Safe and effective tick and flea eradication for pet owners in Thiruvananthapuram.",
  },
  {
    id: "srv-17",
    slug: "sanitation-disinfection",
    title: "Sanitation & Microbial Disinfection",
    category: "pest_control",
    short_desc: "Cold ULV fogging with hospital-grade quaternary ammonium compounds against pathogens.",
    long_desc: "Ultra-Low Volume (ULV) cold misting generates microscopic droplet clouds that hang in the air and coat all exposed touch surfaces, neutralizing 99.99% of viral and bacterial pathogens in homes, schools, and offices.",
    image_url: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=1200&q=80",
    icon: "Activity",
    is_featured: false,
    sort_order: 17,
    meta_title: "Sanitation & Disinfection Services Kerala | PLAN C",
    meta_description: "Hospital-grade misting and surface disinfection in Thiruvananthapuram for homes and clinics.",
  },
  {
    id: "srv-18",
    slug: "rodent-control",
    title: "Rodent & Rat Exclusion Control",
    category: "pest_control",
    short_desc: "Tamper-proof bait stations, glue traps, and structural ingress sealing for zero rat nuisance.",
    long_desc: "Rats damage wiring and pose leptospirosis risks during monsoon months. We install child-proof lockable bait stations, deploy commercial glue boards in false ceilings, and identify entry breaches for permanent structural defense.",
    image_url: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=1200&q=80",
    icon: "Target",
    is_featured: false,
    sort_order: 18,
    meta_title: "Rodent Control & Rat Extermination Trivandrum | PLAN C",
    meta_description: "Professional rodent control, false ceiling trapping, and bait stations in Thiruvananthapuram.",
  },
  {
    id: "srv-19",
    slug: "mosquito-control",
    title: "Mosquito Larvicidal & Fogging",
    category: "pest_control",
    short_desc: "Drainage larvicidal treatment and thermal fogging for yards and community plots.",
    long_desc: "Protect against dengue, malaria, and chikungunya. Our crew treats stagnant rainwater drains with biological insect growth regulators and conducts thermal smoke fogging across gardens and outdoor perimeter walls.",
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    icon: "Wind",
    is_featured: false,
    sort_order: 19,
    meta_title: "Mosquito Control & Yard Fogging Services Kerala | PLAN C",
    meta_description: "Effective mosquito control, anti-larval treatment, and garden misting in Thiruvananthapuram.",
  },

  // 3. Commercial Services
  {
    id: "srv-20",
    slug: "office-commercial-cleaning",
    title: "Office & Commercial Deep Cleaning",
    category: "commercial",
    short_desc: "Custom housekeeping and deep sanitisation for IT firms, clinics, showrooms, and co-working spaces.",
    long_desc: "Designed for Technopark and commercial hubs in Trivandrum. Our uniformed team cleans workstations, monitors, keyboards, executive conference rooms, cafeteria grease traps, and executive washrooms without disrupting normal work hours.",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    icon: "Building2",
    is_featured: true,
    sort_order: 20,
    meta_title: "Office & Commercial Cleaning Services Trivandrum | PLAN C",
    meta_description: "Trusted commercial housekeeping and deep office cleaning in Technopark and Thiruvananthapuram.",
  },
  {
    id: "srv-21",
    slug: "annual-maintenance-contract",
    title: "Annual Maintenance Contracts (AMC)",
    category: "commercial",
    short_desc: "Scheduled monthly or quarterly cleaning and pest control packages with priority SLA.",
    long_desc: "Enjoy hands-off facility management. Our customized commercial AMC contracts cover scheduled deep scrubbing, pest defense treatments, water tank sterilisation, and on-call emergency response at discounted corporate rates.",
    image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    icon: "CalendarCheck",
    is_featured: false,
    sort_order: 21,
    meta_title: "Annual Cleaning & Pest AMC Contracts Kerala | PLAN C",
    meta_description: "Year-round hassle-free cleaning and pest maintenance packages for homes, villas, and commercial establishments.",
  },

  // 4. Specialised Services
  {
    id: "srv-22",
    slug: "garden-cleaning",
    title: "Garden & Lawn Clearing",
    category: "specialised",
    short_desc: "Wild weed clearing, fallen coconut leaf sweeping, hedge pruning, and green waste disposal.",
    long_desc: "Kerala backyards rapidly overgrow during tropical rains. Our specialized outdoor grounds crew clears thorny weeds, trims hedges, sweeps fallen fronds, and carts away organic debris so you can reclaim your outdoor living space.",
    image_url: "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=1200&q=80",
    icon: "Sprout",
    is_featured: true,
    sort_order: 22,
    meta_title: "Garden Cleaning & Yard Clearing Trivandrum | PLAN C",
    meta_description: "Comprehensive yard cleaning, lawn trimming, and garden debris disposal across Thiruvananthapuram.",
  },
  {
    id: "srv-23",
    slug: "post-construction-cleaning",
    title: "Post-Construction Handover Cleaning",
    category: "specialised",
    short_desc: "Removal of cement lumps, paint smears, putty haze, and adhesive tapes from new buildings.",
    long_desc: "Transition smoothly into your dream home. We safely scrape dried plaster and paint splatter off window glass, buff tile grout haze with neutral chemical washes, and polish sanitary fixtures for a flawless housewarming ceremony.",
    image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    icon: "Wrench",
    is_featured: false,
    sort_order: 23,
    meta_title: "Post Construction Cleaning in Kerala | PLAN C",
    meta_description: "Specialised post renovation and newly built house handover cleaning in Thiruvananthapuram.",
  },
  {
    id: "srv-24",
    slug: "marble-granite-polishing",
    title: "Marble & Granite Polishing",
    category: "specialised",
    short_desc: "Diamond disc grinding, crystallisation, and nano-sealant coating for mirror gloss.",
    long_desc: "Restore aged and scratched natural stone floors. We utilize multi-grit diamond abrasive pads and Italian crystallizer liquids to buff marble and granite, sealing stone pores against food stains and restoring a lustrous mirror finish.",
    image_url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    icon: "Gem",
    is_featured: false,
    sort_order: 24,
    meta_title: "Marble & Granite Floor Polishing Kerala | PLAN C",
    meta_description: "Premium diamond crystallization and stone restoration in Thiruvananthapuram.",
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Anil Kumar",
    location: "Pattom, Thiruvananthapuram",
    rating: 5,
    service_name: "Full House Deep Cleaning",
    comment: "Exceptional service by PLAN C! Their crew arrived right on time with rotary scrubbers and specialized bathroom descalers. Our 4BHK house in Pattom feels brand new again. Highly recommended for busy families.",
    approved: true,
    created_at: "2025-05-10T10:30:00Z",
  },
  {
    id: "rev-2",
    name: "Sreelakshmi Nair",
    location: "Kowdiar, Thiruvananthapuram",
    rating: 5,
    service_name: "Kitchen Deep Cleaning",
    comment: "The stubborn oil stains around our modular kitchen chimney seemed impossible to remove, but the PLAN C team dismantled the filters and brought back the original shine. Very polite and respectful staff.",
    approved: true,
    created_at: "2025-05-08T14:15:00Z",
  },
  {
    id: "rev-3",
    name: "Rajesh Pillai",
    location: "Kazhakkoottam, Trivandrum",
    rating: 5,
    service_name: "Sofa & Mattress Shampooing",
    comment: "Got our 6-seater fabric sofa and two queen mattresses shampooed. They extracted an unbelievable amount of hidden dust. Dried within 4 hours. Great work team PLAN C!",
    approved: true,
    created_at: "2025-05-05T09:00:00Z",
  },
  {
    id: "rev-4",
    name: "Divya S.",
    location: "Vattiyoorkavu, Thiruvananthapuram",
    rating: 5,
    service_name: "Bathroom Steam Cleaning",
    comment: "Hard water scaling was an ongoing headache in our master bathroom. Their team descaled the glass partition and tiles without any foul chemical smell. 10/10 quality and hygiene.",
    approved: true,
    created_at: "2025-05-02T16:45:00Z",
  },
  {
    id: "rev-5",
    name: "Mohammed Shafeer",
    location: "Attingal, Kerala",
    rating: 5,
    service_name: "Anti-Termite Treatment",
    comment: "Detected termites near our wooden door frames. PLAN C did a comprehensive perimeter drill barrier treatment. The technician explained every step clearly and gave a warranty certificate. Great peace of mind!",
    approved: true,
    created_at: "2025-04-28T11:20:00Z",
  },
  {
    id: "rev-6",
    name: "Lekha Menon",
    location: "Nedumangad, Thiruvananthapuram",
    rating: 5,
    service_name: "Water Tank & Sump Cleaning",
    comment: "The 6-stage cleaning with UV disinfection was impressive. Our overhead 1000L tank and underground sump water is now crystal clear. Professional and prompt crew.",
    approved: true,
    created_at: "2025-04-24T13:10:00Z",
  },
  {
    id: "rev-7",
    name: "Arun Vijayan",
    location: "Neyyattinkara, Trivandrum",
    rating: 5,
    service_name: "Outdoor & Interlock Cleaning",
    comment: "Our driveway had thick green moss from the heavy monsoon. Their high-pressure jet wash peeled the moss off in minutes! Paving looks as fresh as the day it was laid.",
    approved: true,
    created_at: "2025-04-20T08:30:00Z",
  },
  {
    id: "rev-8",
    name: "Anitha Das",
    location: "Kattakada, Kerala",
    rating: 5,
    service_name: "Cockroach Gel Treatment",
    comment: "Zero smell, no need to take out kitchen utensils. Within 5 days, all cockroach traces vanished from our kitchen cabinets. Very reasonable pricing too.",
    approved: true,
    created_at: "2025-04-16T15:00:00Z",
  },
  {
    id: "rev-9",
    name: "Vishnu Prasad",
    location: "Technopark Phase 3, Trivandrum",
    rating: 5,
    service_name: "Office & Commercial Deep Cleaning",
    comment: "Hired PLAN C for our 35-seater IT office deep sanitisation over the weekend. Carpet vacuuming and workstation dusting was top tier. Our staff loved the fresh atmosphere on Monday morning.",
    approved: true,
    created_at: "2025-04-12T17:30:00Z",
  },
  {
    id: "rev-10",
    name: "Fathima Beevi",
    location: "Varkala, Trivandrum",
    rating: 5,
    service_name: "Post-Construction Handover Cleaning",
    comment: "Had completed home renovation with paint and cement dust everywhere. The PLAN C team spent 8 solid hours scrubbing floor tiles and glass windows. Super happy with the result.",
    approved: true,
    created_at: "2025-04-08T12:00:00Z",
  },
  {
    id: "rev-11",
    name: "Sujith Chandran",
    location: "Thycaud, Thiruvananthapuram",
    rating: 5,
    service_name: "Full House Deep Cleaning",
    comment: "Booked them for pre-festival cleaning. Five cleaners arrived with proper uniform and gear. Every nook and corner was inspected and cleaned. Will hire them regularly!",
    approved: true,
    created_at: "2025-04-03T10:15:00Z",
  },
  {
    id: "rev-12",
    name: "Meera Raj",
    location: "Vellayambalam, Trivandrum",
    rating: 5,
    service_name: "Garden & Lawn Clearing",
    comment: "Overgrown weeds and coconut fronds removed quickly and neatly loaded away. Honest pricing with no hidden charges. Very transparent service.",
    approved: true,
    created_at: "2025-03-29T14:40:00Z",
  },
  {
    id: "rev-13",
    name: "Harikrishnan N.",
    location: "Pettah, Thiruvananthapuram",
    rating: 5,
    service_name: "Mechanized Floor Scrubbing",
    comment: "Our Kota stone flooring had become dull over 10 years. Single disc scrubbing brought back a rich, clean finish. Really impressed by the modern machinery they use.",
    approved: true,
    created_at: "2025-03-22T11:00:00Z",
  },
  {
    id: "rev-14",
    name: "Blessy Thomas",
    location: "Kanjirampara, Thiruvananthapuram",
    rating: 5,
    service_name: "Bed Bugs Eradication",
    comment: "We were struggling with bed bugs in guest room mattresses for months. Two rounds of treatment completely resolved the problem. Professional and empathetic team.",
    approved: true,
    created_at: "2025-03-15T09:30:00Z",
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "deep-cleaning-checklist-for-kerala-homes",
    title: "Deep Cleaning Checklist for Kerala Homes: Ultimate Room-by-Room Guide",
    excerpt: "From combating high coastal humidity to tackling hard water stains on tiles, here is the complete checklist tailored for Kerala residences.",
    content: `# The Complete Deep Cleaning Checklist for Kerala Homes

Maintaining a home in Kerala comes with unique environmental challenges: tropical humidity consistently exceeding 80%, seasonal monsoons, fine red laterite soil dust, and hard borewell water that leaves thick mineral scale. A routine broom sweep and damp mop isn't enough to keep hidden mildew, grease, and calcium scale at bay.

Here is the professional room-by-room deep cleaning checklist formulated by **PLAN C Cleaning Solutions** for homeowners in Thiruvananthapuram, Kowdiar, Pattom, and Kazhakkoottam.

---

## 1. Living Room & Common Areas
- **Ceiling Fans & High Fixtures**: Wipe fan blades with an anti-static microfiber cloth dampened with mild degreaser; wash down glass pendant lamps and chandelier shades.
- **Window Sills & Mosquito Meshes**: Unclip nylon meshes and wash them with soapy water; vacuum aluminum window slider channels where red dust compacts into hard sludge.
- **Curtains & Drapery**: Steam vacuum heavy draperies or launder sheer curtains to extract trapped fine pollen and road soot.
- **Sofa & Fabric Upholstery**: Vacuum crevice areas under cushions; opt for professional injection-extraction shampooing every 6 months to eliminate dust mites and body sweat oils.

## 2. Kitchen & Pantry Hygiene
- **Electric Chimney & Exhaust Blower**: Kerala cuisine involves generous use of coconut oil, mustard seeds, and pungent spices, forming sticky greasy crusts. Soak baffle filters in warm bio-degreaser baths.
- **Behind Refrigerators & Heavy Appliances**: Pull out heavy appliances to scrub accumulated cobwebs, pet hair, and greasy dust films.
- **Modular Cabinets**: Empty shelves, wipe inner laminate linings with antiseptic wipes, and apply odorless insect repellent gel in corner hinges.
- **Tile Grout Lines**: Use neutral pH tile cleaners to dissolve dark grease lines between tiles without eroding cement grout.

## 3. Bathrooms & Washrooms
- **Hard Water Descaling**: Kerala borewell water leaves chalky white and yellow mineral rings on taps, showers, and ceramic washbasins. Use non-hydrochloric descaling agents to avoid corroding chrome.
- **Exhaust Vent Scrubbing**: Clear moisture buildup and lint from bathroom ventilation grilles to prevent mold breeding.
- **Floor Tile Scrubbing**: Rotary mechanized scrubbing restores anti-skid floor texture and destroys slippery black fungal slime.

## 4. Water Tank & Exterior Areas
- Clean overhead Sintex or concrete water tanks twice a year to prevent sediment and bacterial biofilm.
- High-pressure wash outdoor interlock pathways before and after the South-West monsoon to prevent slip accidents.

> **Need hands-on help?** PLAN C Cleaning Solutions provides comprehensive house deep cleaning across Thiruvananthapuram, Kowdiar, Pattom, Kazhakkoottam, and nearby towns. Call **7994342372** for a free site assessment.`,
    cover_image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    category: "Home Cleaning",
    tags: ["Deep Cleaning", "Kerala Homes", "Trivandrum", "Home Maintenance"],
    author: "PLAN C Technical Crew",
    published: true,
    meta_title: "Deep Cleaning Checklist for Kerala Homes | PLAN C Cleaning",
    meta_description: "Complete room-by-room deep cleaning guide for homes in Thiruvananthapuram and Kerala. Expert tips for tackling humidity, hard water stains, and kitchen grease.",
    published_at: "2025-05-02T10:00:00Z",
  },
  {
    id: "blog-2",
    slug: "how-to-prevent-termites-in-kerala-humid-climate",
    title: "How to Prevent Termites in Kerala's Humid Climate: An Expert Guide",
    excerpt: "Subterranean termites thrive in Kerala's red soil and heavy moisture. Learn the early warning indicators and professional defense barriers.",
    content: `# How to Prevent Termites in Kerala's Humid Climate

Termites (known locally as *chempan* or *karayan*) cause millions of rupees in structural damage to Kerala homes every year. The combination of rich laterite soil, frequent rainfall, and warm humidity makes South Kerala an ideal breeding ground for subterranean termites.

---

## The Hidden Danger of Subterranean Termites
Unlike drywood termites, subterranean termites live deep in the soil and build mud tunnels (shelter tubes) to access wood, paper, and cellulose inside your home. By the time you notice hollow wooden door frames or bubbling wall paint, the internal structural integrity of your furniture may already be destroyed.

## 5 Early Warning Signs in Your Home
1. **Mud Tubes on Foundation & Skirting**: Thin brown mud trails climbing up foundation pillars, skirting tiles, or inside electrical conduit pipes.
2. **Hollow Sounding Timber**: Tapping wooden window frames or wardrobe backs produces an empty, papery sound.
3. **Discarded Wings Near Windows**: Swarming alates (flying termites) shed their translucent wings in piles near light fixtures during pre-monsoon evenings.
4. **Stuck Doors and Windows**: Moisture introduced by termite nests can cause timber frames to swell and jam.
5. **Fine Wood Frass & Sawdust**: Piles of powdery pellets beneath wooden beams.

## Preventive Measures for Homeowners
- **Eliminate Soil-to-Wood Contact**: Ensure wooden trellis, garden mulch, and fence posts do not directly touch building foundations.
- **Fix Plumbing Leaks Promptly**: Damp walls create the wet environment subterranean colonies need to survive.
- **Ensure Proper Ventilation**: Keep attics, basements, and modular under-sink cabinets dry with good airflow.
- **Schedule Chemical Barrier Drilling**: Professional anti-termite treatment involves drilling precision 12mm holes around the perimeter and injecting termiticide barriers with multi-year warranties.

> **Protect your dream home**: PLAN C Pest Control provides certified anti-termite treatments across Thiruvananthapuram and Kollam with up to 5 years guarantee. Call **7994342372** to book an inspection.`,
    cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    category: "Pest Control",
    tags: ["Termite Control", "Pest Prevention", "Kerala Climate", "Home Care"],
    author: "PLAN C Pest Control Specialist",
    published: true,
    meta_title: "Termite Prevention Guide for Kerala Homes | PLAN C Pest Control",
    meta_description: "Learn how to detect and prevent subterranean termites in Kerala. Expert advice on termite barriers, mud tube detection, and long-term warranties.",
    published_at: "2025-04-28T09:30:00Z",
  },
  {
    id: "blog-3",
    slug: "how-often-should-you-clean-your-water-tank",
    title: "How Often Should You Clean Your Water Tank in Kerala?",
    excerpt: "Drinking water safety is paramount. Discover why seasonal sediment buildup necessitates bi-annual 6-stage mechanized tank sanitisation.",
    content: `# How Often Should You Clean Your Water Tank in Kerala?

In Kerala, most residences rely either on open wells, deep borewells, or municipal water authority (KWA) pipelines connected to underground sumps and overhead Sintex or concrete tanks.

Yet, water tanks are frequently the most neglected aspect of household hygiene.

---

## What Lurks Inside an Uncleaned Water Tank?
Even clean-looking tap water carries trace minerals, dissolved solids, and microbial spores. Over 3 to 6 months:
- **Sedimentation**: Heavy iron, silt, and clay settle at the base, creating a 2 to 5 inch thick layer of sludge.
- **Biofilm & Algae**: Sunlight and warm temperatures allow green algae and slick bacterial biofilm to cling to tank walls.
- **Pathogens**: Stagnant sediment fosters bacteria including E. coli, Salmonella, and coliforms, causing waterborne illnesses, skin rashes, and hair fall.

## Recommended Cleaning Frequency
- **Residential Overhead Tanks (1,000L - 2,000L)**: Every **4 to 6 months**.
- **Underground Sumps**: At least **twice a year**, ideally right after the heavy monsoon downpours when groundwater runoff carries maximum turbidity.
- **Restaurants, Hotels & Hostels**: **Quarterly (every 3 months)** to meet Food Safety and Health Standards.

## Why Manual Scrubbing With Bleaching Powder Fails
Traditional local cleaners use harsh bleaching powder and an old brush, often leaving strong chlorine chemical smells and failing to eliminate microscopic biofilm in corners.

PLAN C's 6-Stage Mechanized Protocol:
1. **Deep Dewatering**: Specialized submersible pumps drain old stagnant water.
2. **Sludge Extraction**: Industrial wet vacuum cleaners suck out thick bottom muck.
3. **High-Pressure Rotary Jet Wash**: Strips stubborn algae and mineral crusts from wall corners.
4. **Vacuum Residue Clearing**: Clears all dislodged debris completely.
5. **Anti-Bacterial Spraying**: Safe, food-grade eco-friendly disinfectant sanitizes all surfaces.
6. **UV Radiator Sterilization**: High-intensity ultraviolet lamp kills any remaining floating spores.

> **Ensure 100% pure tap water for your family**: Book our 6-stage water tank sanitisation service in Trivandrum today at **7994342372**.`,
    cover_image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1200&q=80",
    category: "Water Hygiene",
    tags: ["Water Tank Cleaning", "Health & Safety", "Thiruvananthapuram", "Pure Water"],
    author: "PLAN C Technical Crew",
    published: true,
    meta_title: "Water Tank Cleaning Frequency & Hygiene in Kerala | PLAN C",
    meta_description: "How often should you clean overhead tanks and sumps in Kerala? Discover the 6-stage mechanized cleaning procedure by PLAN C Cleaning Solutions.",
    published_at: "2025-04-20T11:15:00Z",
  },
  {
    id: "blog-4",
    slug: "bed-bug-removal-what-actually-works",
    title: "Bed Bug Removal in Kerala: What Actually Works (and What Fails)",
    excerpt: "Tired of ineffective camphor and kerosene hacks? Here is the scientific approach to eliminating bed bugs permanently from mattresses and furniture.",
    content: `# Bed Bug Removal: What Actually Works (and What Fails)

Bed bug infestations are on the rise across Kerala, particularly in rental apartments, university hostels, and frequently traveled family homes in Trivandrum, Kochi, and Kozhikode.

Because bed bug eggs are microscopic and resistant to ordinary pesticide sprays, homemade hacks rarely eliminate the colony.

---

## Popular DIY Hacks That Fail
- **Camphor (*Karpooram*)**: May temporarily repel bugs from a single pillow, but pushes the colony into nearby wardrobe crevices and electrical sockets.
- **Kerosene / Petrol**: Highly flammable, produces hazardous toxic fumes, stains mattresses, and does not kill bed bug eggs.
- **Sun-Drying Mattresses**: In Kerala's humid air, outdoor sunlight rarely raises the mattress core temperature above the 55°C required to kill eggs nested 4 inches deep.

## What Science & Professional IPM Recommends

### 1. High-Heat Thermal Steam Treatment
Bed bugs and their eggs die instantly when exposed to temperatures exceeding 60°C. Professional steam cleaners inject 140°C dry steam into mattress tufts, seams, headboard slots, and sofa joints without soaking the fabric.

### 2. Dual-Visit Chemical Treatment
Pesticides kill crawling adults and nymphs, but unhatched eggs remain protected by their protective shell. Therefore, a professional service **must include a second round after 12-15 days** to target newly hatched nymphs before they reach reproductive maturity.

### 3. Mattress Encasement & Room Prep
Wash all bed sheets, blankets, and pillow covers in hot water (above 60°C). Vacuum headboards and seal cracks along wall baseboards.

> **Sleep peacefully again without bites**: Contact PLAN C Pest Control for discreet, guaranteed bed bug eradication in Thiruvananthapuram. Call **7994342372**.`,
    cover_image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?auto=format&fit=crop&w=1200&q=80",
    category: "Pest Control",
    tags: ["Bed Bug Treatment", "Pest Control Kerala", "Sleep Hygiene", "Disinfection"],
    author: "PLAN C Technical Crew",
    published: true,
    meta_title: "Bed Bug Removal in Kerala: Complete Eradication Guide | PLAN C",
    meta_description: "Discover why DIY bed bug hacks fail and how PLAN C's thermal steam and targeted pest control eliminates bed bugs completely.",
    published_at: "2025-04-14T14:00:00Z",
  },
  {
    id: "blog-5",
    slug: "monsoon-cleaning-tips-for-thiruvananthapuram-homes",
    title: "Monsoon Cleaning Tips for Thiruvananthapuram Homes",
    excerpt: "Prepare your home against slippery moss, black fungal mildew, damp closets, and roof drain clogs during Kerala rains.",
    content: `# Monsoon Cleaning Tips for Thiruvananthapuram Homes

The monsoon in Kerala brings lush greenery and cool weather, but also brings constant humidity, mud splatter, musty odors, and treacherous green moss on outdoor tiles.

Here is how you can safeguard your home before and during the monsoon season.

---

## 1. Eliminate Slippery Interlock Algae Early
Kerala's heavy showers quickly turn interlock pavers, car porches, and granite steps into slip hazards. High-pressure jet washing removes the slime layer deep in the concrete pores. Applying an anti-fungal wash ensures moss doesn't reappear after the next rainfall.

## 2. Fight Fungus and Mildew in Wardrobes
Keep camphor tablets, silica gel packets, or moisture absorber boxes inside wooden wardrobes to stop mold from growing on leather shoes, cotton sarees, and coats. Wipe interior cabinet walls with a diluted vinegar-water solution every fortnight.

## 3. Clear Roof Gutters & Rainwater Inlets
Dead leaves, coconut fronds, and dirt block roof drain pipes, causing water stagnation and terrace seepage. Clean your terrace spouts and gutters before the torrential rains begin.

## 4. Ward Off Monsoon Pests
The wet ground drives cockroaches, centipedes, and rodents indoors seeking shelter and food. Seal pipe inlets under sinks and schedule preventative pest control before the season sets in.

> **Prepare your home for the rains**: PLAN C offers customized pre-monsoon and post-monsoon deep cleaning packages in Thiruvananthapuram. Call **7994342372** today.`,
    cover_image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    category: "Seasonal Cleaning",
    tags: ["Monsoon Cleaning", "Trivandrum", "Outdoor Cleaning", "Mold Prevention"],
    author: "PLAN C Editorial Team",
    published: true,
    meta_title: "Monsoon Cleaning Tips for Thiruvananthapuram Homes | PLAN C",
    meta_description: "Keep your house safe from mold, slippery moss, and pests during Kerala rains with these professional monsoon cleaning tips.",
    published_at: "2025-04-05T08:00:00Z",
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "book-1",
    booking_code: "PC-2025-0001",
    name: "Anand Krishnan",
    email: "anand.k@example.com",
    phone: "9847123456",
    service_id: "srv-1",
    service_name: "Full House Deep Cleaning",
    address: "TC 14/1205, Jawahar Nagar, Kowdiar, Thiruvananthapuram",
    preferred_date: "2025-05-18",
    message: "Need deep cleaning before housewarming ceremony. 3BHK villa.",
    status: "Confirmed",
    assigned_team: "Unit A - Lead: Suresh",
    admin_notes: "Customer requested morning 8:30 AM arrival.",
    created_at: "2025-05-15T09:30:00Z",
  },
  {
    id: "book-2",
    booking_code: "PC-2025-0002",
    name: "Revathi Chandran",
    email: "revathi.c@example.com",
    phone: "9745678901",
    service_id: "srv-7",
    service_name: "Water Tank & Sump Cleaning",
    address: "Flat 4B, Heera Towers, Pattom, Trivandrum",
    preferred_date: "2025-05-16",
    message: "Underground sump 4000L and overhead 1000L tank cleaning.",
    status: "In progress",
    assigned_team: "Unit C - Lead: Rajesh",
    admin_notes: "Technicians on route with jet pumps.",
    created_at: "2025-05-14T11:00:00Z",
  },
  {
    id: "book-3",
    booking_code: "PC-2025-0003",
    name: "Dr. Thomas George",
    email: "dr.thomas@example.com",
    phone: "9447112233",
    service_id: "srv-12",
    service_name: "General Pest Control",
    address: "Villa 12, Technopark Enclave, Kazhakkoottam",
    preferred_date: "2025-05-20",
    message: "Cockroach and ant treatment in kitchen and store room.",
    status: "Pending",
    assigned_team: "Unit B - Lead: Dileep",
    admin_notes: "Pending customer confirmation on Saturday slot.",
    created_at: "2025-05-15T14:20:00Z",
  },
  {
    id: "book-4",
    booking_code: "PC-2025-0004",
    name: "Deepa Jayakumar",
    email: "deepa.j@example.com",
    phone: "9895001122",
    service_id: "srv-8",
    service_name: "Sofa, Mattress & Carpet Shampooing",
    address: "Devi Kripa, Thrikannapuram, Thiruvananthapuram",
    preferred_date: "2025-05-12",
    message: "L-shaped fabric sofa shampooing and stain removal.",
    status: "Completed",
    assigned_team: "Unit A - Lead: Suresh",
    admin_notes: "Service completed successfully. Customer left 5 star review.",
    created_at: "2025-05-11T16:00:00Z",
  },
];

