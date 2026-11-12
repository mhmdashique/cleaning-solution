-- ==============================================================================
-- PLAN C Cleaning Solutions - Seed Data
-- ==============================================================================

-- 1. SITE SETTINGS
INSERT INTO site_settings (key, value) VALUES
('company_name', 'PLAN C Cleaning Solutions'),
('tagline', 'You leave it, we clean it'),
('phone', '7994342372'),
('phone_display', '+91 79943 42372'),
('whatsapp', '917994342372'),
('email', 'contact@plancsolutions.in'),
('address', 'Thrikannapuram, Thiruvananthapuram, Kerala - 695032'),
('working_hours', 'Monday - Sunday: 7:00 AM - 9:00 PM'),
('experience_years', '5+'),
('service_areas', 'Thrikannapuram, Pattom, Kowdiar, Kazhakkoottam, Technopark, Attingal, Nedumangad, Neyyattinkara, Vattiyoorkavu, Vellayambalam, Thycaud, Varkala, Kattakada, Kanjirampara, Trivandrum, Kollam'),
('meta_title', 'PLAN C Cleaning Solutions - Professional House Cleaning & Pest Control in Kerala'),
('meta_description', 'PLAN C Cleaning Solutions offers expert house cleaning, pest control, and specialized services across Thiruvananthapuram and Kerala. Book now for a spotless home!')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. CORE SERVICES
INSERT INTO services (slug, title, category, short_desc, long_desc, image_url, icon, is_featured, sort_order, meta_title, meta_description) VALUES
-- Cleaning Services
('full-house-deep-cleaning', 'Full House Deep Cleaning', 'cleaning',
 'Comprehensive top-to-bottom sanitisation and deep scrubbing of your entire home in Kerala.',
 'Our signature Full House Deep Cleaning service covers every corner of your home. Using professional single-disc rotary scrubbers, industrial wet & dry vacuums, and eco-friendly safe chemicals, we remove stubborn grime, yellow calcium stains, grease deposits, and concealed dust from ceilings, walls, windows, fans, floors, and cabinetry.',
 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
 'Sparkles', true, 1,
 'Full House Deep Cleaning in Thiruvananthapuram | PLAN C',
 'Book professional full house deep cleaning in Thiruvananthapuram and across Kerala. 5+ years experience, modern equipment, eco-safe solutions.'),

('normal-cleaning', 'Normal & Regular House Cleaning', 'cleaning',
 'Routine sweeping, moping, dusting, and wiping to keep your home fresh and tidy.',
 'Perfect for weekly or bi-weekly maintenance. Our trained domestic crew handles complete sweeping, damp mopping with disinfectant solutions, surface dusting, furniture wipe-down, waste disposal, and kitchen counter sanitisation.',
 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
 'Brush', false, 2,
 'Regular House Cleaning Services in Trivandrum | PLAN C',
 'Reliable domestic regular house cleaning services in Thiruvananthapuram. Affordable rates, verified staff, and consistent quality.'),

('kitchen-deep-cleaning', 'Kitchen Deep Cleaning', 'cleaning',
 'Degreasing of chimneys, tiles, cabinets, stoves, and deep sanitisation of prep surfaces.',
 'Kitchens in Kerala homes bear heavy oil vapor and spice residues. Our specialised kitchen deep cleaning utilizes food-grade degreasers and steam power to dissolve tough oil crusts on chimneys, exhaust fans, wall tiles, modular cabinets inside-out, granite countertops, and gas hobs.',
 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
 'UtensilsCrossed', true, 3,
 'Kitchen Deep Cleaning in Thiruvananthapuram | PLAN C',
 'Professional kitchen degreasing and tile cleaning in Kerala. Remove stubborn oil, soot, and bacteria with PLAN C Cleaning.'),

('bathroom-deep-cleaning', 'Bathroom Deep Cleaning', 'cleaning',
 'Intensive hard-water stain removal, grout scrubbing, and acid-free tile descaling.',
 'Kerala borewell and municipal water frequently causes tough yellow salt and scale deposits on bathroom tiles and chrome fixtures. Our bathroom deep cleaning removes limescale, scum, fungal growth, and discolours grout without damaging ceramic glazes.',
 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
 'Bath', true, 4,
 'Bathroom Deep Cleaning in Trivandrum | PLAN C',
 'Eradicate hard water stains and germs with our bathroom deep cleaning services in Thiruvananthapuram. Safe sanitisation guaranteed.'),

('bathroom-steam-cleaning', 'Bathroom Steam Sanitisation', 'cleaning',
 '140°C chemical-free high-pressure steam cleaning for 99.9% germ and mold eradication.',
 'High humidity in Kerala creates black mould and hidden bacteria in silicone joints and crevices. Our high-pressure thermal steam cleaner penetrates microscopic tile pores, killing allergens and bacterial spores without harsh chemical fumes.',
 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
 'Flame', false, 5,
 'Bathroom Steam Cleaning Services Kerala | PLAN C',
 'Chemical-free high-temperature steam sanitisation for residential and commercial washrooms in Trivandrum.'),

('floor-scrubbing-polishing', 'Floor Scrubbing & Polishing', 'cleaning',
 'Single-disc mechanized scrubbing for vitrified tiles, granite, Kota stone, and marble.',
 'Over time, foot traffic and humidity dull floor surfaces and darken grout lines. Our rotary single-disc floor scrubbers paired with neutral pH floor conditioners lift embedded soil, strip grime, and restore natural floor sheen.',
 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1200&q=80',
 'Layers', false, 6,
 'Mechanized Floor Scrubbing & Polishing Trivandrum | PLAN C',
 'Industrial-grade rotary floor scrubbing and deep tile restoration in Thiruvananthapuram, Kerala.'),

('water-tank-cleaning', 'Water Tank & Sump Cleaning', 'cleaning',
 '6-stage mechanized cleaning and UV disinfection for overhead tanks and underground sumps.',
 'Ensure clean, contamination-free drinking water. Our certified procedure includes dewatering, sludge extraction with high-power pumps, high-pressure rotary jet cleaning, vacuum suction, anti-bacterial spray, and UV sterilisation.',
 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1200&q=80',
 'Droplets', true, 7,
 'Water Tank & Sump Cleaning in Thiruvananthapuram | PLAN C',
 '6-step hygienic water tank and underground sump cleaning in Kerala. Safe UV disinfection and certified process.'),

('sofa-mattress-carpet-shampooing', 'Sofa, Mattress & Carpet Shampooing', 'cleaning',
 'Deep injection-extraction foam wash that removes stains, dust mites, and foul odors.',
 'Kerala humidity promotes dust mites and mold inside fabric upholstery. Our German injection-extraction vacuum pumps deep shampoo foam into couches, mattresses, and woolen rugs, extracting pet dander, beverage stains, and allergens.',
 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
 'Armchair', true, 8,
 'Upholstery & Sofa Shampooing in Trivandrum | PLAN C',
 'Onsite fabric sofa, mattress sanitisation, and carpet shampooing in Thiruvananthapuram. Quick dry technology.'),

('outdoor-interlock-cleaning', 'Outdoor & Interlock Paver Cleaning', 'cleaning',
 'High-PSI pressure washing to strip moss, black fungal slime, and mud from driveways.',
 'Monsoon rains in Kerala coat interlock driveways, compound walls, and porch tiles with slippery green algae and dark fungus. Our 200+ BAR pressure washers blast away years of grime without damaging paving stones.',
 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
 'TreePine', false, 9,
 'Interlock & Outdoor Pressure Washing Trivandrum | PLAN C',
 'Restore slippery interlock pavers and exterior pathways with high-pressure water blasting across Thiruvananthapuram.'),

('glass-window-cleaning', 'Glass & Facade Cleaning', 'cleaning',
 'Streak-free window, glass railing, and structural glazing cleaning with telescopic kits.',
 'Crystal clear views with zero smudges. We use pure-water telescopic poles and streak-free squeegees for architectural glass, French doors, glass balconies, and solar panels.',
 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
 'Maximize2', false, 10,
 'Glass & Window Cleaning Services Kerala | PLAN C',
 'Professional streak-free window, sliding glass, and facade cleaning for homes and commercial complexes in Kerala.'),

-- Pest Control Services
('general-pest-control', 'General Pest Control', 'pest_control',
 'Comprehensive indoor defense against crawling and flying insects with government-approved odorless sprays.',
 'Protect your family from cockroaches, silverfish, ants, and spiders. Our integrated pest management (IPM) treatment uses odorless Bayer/Syngenta formulations safe for infants and senior citizens.',
 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=80',
 'ShieldCheck', true, 11,
 'General Pest Control Services in Thiruvananthapuram | PLAN C',
 'Certified odorless pest control solutions for residential and commercial premises in Trivandrum, Kerala.'),

('anti-termite-treatment', 'Anti-Termite Treatment (Pre & Post)', 'pest_control',
 'Subterranean termite defense with chemical barrier drilling and long-term warranties.',
 'Kerala red soil and wet climate are hotbeds for destructive white ants (termites). We drill 12mm holes along inner perimeter walls, inject active termiticide barriers, and seal holes seamlessly, providing multi-year protection certificates.',
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
 'Bug', true, 12,
 'Termite Control & Anti-Termite Treatment Trivandrum | PLAN C',
 'Long-lasting subterranean termite barrier treatments with warranty in Thiruvananthapuram. Free site inspection.'),

('cockroach-gel-treatment', 'Cockroach Gel & Herbal Treatment', 'pest_control',
 'Precision target gel baiting inside modular drawers and motor housings without emptying utensils.',
 'Eliminate German and American cockroach colonies without emptying kitchen utensils or dealing with chemical stench. Our micro-drop fipronil and herbal bait gels deliver complete nest extinction within 7 days.',
 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
 'Crosshair', false, 13,
 'Cockroach Control in Thiruvananthapuram | PLAN C',
 'Odorless cockroach gel baiting for homes and commercial kitchens in Trivandrum. No need to empty cupboards.'),

('bed-bugs-treatment', 'Bed Bugs Eradication & Steam Wash', 'pest_control',
 'Two-stage intensive contact and residual knockdown plus high-heat mattress steaming.',
 'Bed bug infestations disrupt sleep and cause distressing bites. We perform thorough thermal steaming combined with safe micro-encapsulated sprays in bed frames, headboards, mattress seams, and switchboard cavities.',
 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
 'AlertCircle', false, 14,
 'Bed Bug Treatment in Thiruvananthapuram | PLAN C',
 'Guaranteed bed bug eradication with dual visit treatments and mattress steaming in Kerala.'),

('rodent-control', 'Rodent & Rat Control', 'pest_control',
 'Tamper-proof bait stations, glue traps, and entry-point rodent exclusion.',
 'Prevent property destruction and leptospirosis. We deploy secure rat bait boxes, heavy-duty glue boards in false ceilings, and offer entry hole sealing consultation for homes, restaurants, and IT offices in Technopark.',
 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=1200&q=80',
 'Target', false, 15,
 'Rodent Control & Rat Extermination Trivandrum | PLAN C',
 'Professional rodent control and false ceiling baiting for homes and offices in Thiruvananthapuram.'),

('mosquito-control-fogging', 'Mosquito Control & Thermal Fogging', 'pest_control',
 'Larvicidal water treatment and cold ULV misting for yards, gardens, and drains.',
 'Combat dengue and mosquito nuisances. We treat stagnant drain outlets with biological larvicides and perform outdoor thermal fogging for large residential plots, schools, and apartment compounds.',
 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
 'Wind', false, 16,
 'Mosquito Control & Yard Fogging Services Kerala | PLAN C',
 'Effective mosquito control, anti-larval treatment, and garden misting in Thiruvananthapuram.'),

-- Commercial & Specialized Services
('office-commercial-cleaning', 'Office & Commercial Deep Cleaning', 'commercial',
 'Tailored housekeeping and deep sanitisation for IT offices, clinics, and retail stores.',
 'Keep your workplace pristine and productive. Includes workstation dusting, keyboard sanitisation, conference room vacuuming, pantry degreasing, and restroom sanitisation during off-peak hours.',
 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
 'Building2', true, 17,
 'Office & Commercial Cleaning Services Trivandrum | PLAN C',
 'Trusted commercial housekeeping and deep office cleaning in Technopark and Thiruvananthapuram.'),

('garden-and-lawn-cleaning', 'Garden & Lawn Clearing', 'specialised',
 'Weed removal, dead foliage clearing, perimeter trimming, and organic waste disposal.',
 'Kerala backyards quickly overgrow during tropical rains. We clear unmanageable weeds, prune overgrown hedges, sweep fallen coconut leaves, and cart away yard debris for clean open spaces.',
 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=1200&q=80',
 'Sprout', false, 18,
 'Garden Cleaning & Yard Clearing Trivandrum | PLAN C',
 'Comprehensive yard cleaning, lawn trimming, and garden debris disposal across Thiruvananthapuram.'),

('post-construction-cleaning', 'Post-Construction & Renovation Cleaning', 'specialised',
 'Removal of cement splatter, paint drips, drywall dust, and tape residue from newly built properties.',
 'Handover-ready perfection. We remove stubborn cement lumps, paint smears from window panes, adhesive residues, and tile grout haze so your newly built house or villa is spotless for housewarming.',
 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
 'Wrench', false, 19,
 'Post Construction Cleaning in Kerala | PLAN C',
 'Specialised post renovation and newly built house handover cleaning in Thiruvananthapuram.'),

('move-in-move-out-cleaning', 'Move-In / Move-Out Cleaning', 'cleaning',
 'Thorough turnover cleaning for landlords, tenants, and real estate agencies.',
 'Moving into a new home or leaving an apartment? Ensure you get your security deposit back or step into a 100% disinfected home with our thorough move-in/move-out package.',
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
 'Truck', false, 20,
 'Move-In & Move-Out House Cleaning Trivandrum | PLAN C',
 'Detailed pre-move and tenancy turnover cleaning services in Thiruvananthapuram.'),

('chimney-exhaust-cleaning', 'Kitchen Chimney & Exhaust Cleaning', 'specialised',
 'Baffle filter soaking, motor blower degreasing, and carbon duct clearing.',
 'Heavy frying and traditional Kerala cooking clog chimney filters quickly. We dismantle filters, submerge them in heavy-duty oil-dissolving baths, and clean exhaust blades to restore maximum suction.',
 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
 'Fan', false, 21,
 'Kitchen Chimney Cleaning Services Trivandrum | PLAN C',
 'Expert electric chimney and exhaust blower degreasing across Thiruvananthapuram.'),

('marble-granite-polishing', 'Marble & Granite Polishing', 'specialised',
 'Diamond pad hone grinding, crystallization, and sealant protection for natural stone floors.',
 'Eliminate scratches and restore mirror-like gloss on Italian marble, Indian marble, and granite with high-speed crystallization chemicals and diamond disc pads.',
 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
 'Gem', false, 22,
 'Marble & Granite Floor Polishing Kerala | PLAN C',
 'Premium diamond crystallization and stone restoration in Thiruvananthapuram.'),

('swimming-pool-cleaning', 'Swimming Pool Cleaning & Maintenance', 'specialised',
 'Vacuuming bottom debris, balancing chlorine/pH levels, and filter backwashing.',
 'Keep your private villa pool or club swimming pool sparkling and hygienic. Includes algae scrubbing, leaf netting, sand filter backwashing, and precise chemical balancing.',
 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
 'Waves', false, 23,
 'Swimming Pool Cleaning Services Trivandrum | PLAN C',
 'Professional pool maintenance and chemical balancing for villas and resorts in Kerala.'),

('annual-maintenance-contract', 'Annual Maintenance Contracts (AMC)', 'commercial',
 'Scheduled quarterly or monthly cleaning and pest control maintenance packages for residences and businesses.',
 'Peace of mind all year round. Custom AMC schedules cover scheduled deep cleans, periodic pest repellence, water tank sterilisation, and priority emergency response at discounted corporate rates.',
 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
 'CalendarCheck', false, 24,
 'Annual Cleaning & Pest AMC Contracts Kerala | PLAN C',
 'Year-round hassle-free cleaning and pest maintenance packages for homes, villas, and commercial establishments.')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  short_desc = EXCLUDED.short_desc,
  long_desc = EXCLUDED.long_desc,
  image_url = EXCLUDED.image_url,
  icon = EXCLUDED.icon,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;


-- ==============================================================================
-- No sample reviews, blog posts or bookings are seeded.
-- Those tables start empty: real records are created through the admin
-- dashboard or via the public booking / review / contact forms.
-- ==============================================================================
