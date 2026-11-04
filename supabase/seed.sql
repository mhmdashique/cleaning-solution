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
('service_areas', 'Thrikannapuram, Pattom, Kowdiar, Kazhakkoottam, Technopark, Attingal, Nedumangad, Neyyattinkara, Vattiyoorkavu, Vellayambalam, Thycaud, Varkala')
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
 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?auto=format&fit=crop&w=1200&q=80',
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

-- 3. REVIEWS SEED (Realistic South Kerala names & locations)
INSERT INTO reviews (name, location, rating, service_name, comment, approved, created_at) VALUES
('Anil Kumar', 'Pattom, Thiruvananthapuram', 5, 'Full House Deep Cleaning',
 'Exceptional service by PLAN C. Their crew arrived right on time with rotary scrubbers and specialized bathroom cleaners. Our 4BHK house in Pattom feels like brand new! Highly recommended.', true, NOW() - INTERVAL '3 days'),

('Sreelakshmi Nair', 'Kowdiar, Thiruvananthapuram', 5, 'Kitchen Deep Cleaning & Chimney Degreasing',
 'The oil stains around our modular kitchen chimney were stubborn, but the PLAN C team completely dismantled the filters and brought back the original shine. Very polite and respectful staff.', true, NOW() - INTERVAL '6 days'),

('Rajesh Pillai', 'Kazhakkoottam, Trivandrum', 5, 'Sofa & Mattress Shampooing',
 'Got our 6-seater fabric sofa and two queen mattresses shampooed. They extracted unbelievable amount of hidden dust. Dried within 4 hours. Great work team PLAN C!', true, NOW() - INTERVAL '9 days'),

('Divya S.', 'Vattiyoorkavu, Thiruvananthapuram', 5, 'Bathroom Steam Cleaning',
 'Hard water scaling was an ongoing headache in our master bathroom. Their team descaled the glass partition and tiles without any foul chemical smell. 10/10 quality.', true, NOW() - INTERVAL '12 days'),

('Mohammed Shafeer', 'Attingal, Kerala', 5, 'Anti-Termite Treatment',
 'Detected termites near our wooden door frames. PLAN C did a comprehensive perimeter drill barrier treatment. The technician explained every step and gave a warranty card. Peace of mind!', true, NOW() - INTERVAL '15 days'),

('Lekha Menon', 'Nedumangad, Thiruvananthapuram', 5, 'Water Tank & Sump Cleaning',
 'The 6-stage cleaning with UV disinfection was impressive. The overhead 1000L tank and underground sump water is now crystal clear. Professional and prompt.', true, NOW() - INTERVAL '18 days'),

('Arun Vijayan', 'Neyyattinkara, Trivandrum', 5, 'Outdoor Interlock Paver Cleaning',
 'Our driveway had thick green moss from the heavy monsoon. Their high-pressure jet wash peeled the moss off in minutes! Paving looks as fresh as the day it was laid.', true, NOW() - INTERVAL '21 days'),

('Anitha Das', 'Kattakada, Kerala', 5, 'Cockroach Gel Treatment',
 'Zero smell, no need to take out kitchen utensils. Within 5 days, all cockroach traces vanished from our kitchen cabinets. Very reasonable pricing too.', true, NOW() - INTERVAL '25 days'),

('Vishnu Prasad', 'Technopark Phase 3, Trivandrum', 5, 'Office Deep Cleaning',
 'Hired PLAN C for our 35-seater IT office deep sanitisation over the weekend. Carpet vacuuming and workstation dusting was top tier. Our staff loved the fresh atmosphere on Monday morning.', true, NOW() - INTERVAL '28 days'),

('Fathima Beevi', 'Varkala, Trivandrum', 5, 'Post-Construction Cleaning',
 'Had completed home renovation with paint and cement dust everywhere. The PLAN C team spent 8 solid hours scrubbing floor tiles and glass windows. Super happy with the result.', true, NOW() - INTERVAL '32 days'),

('Sujith Chandran', 'Thycaud, Thiruvananthapuram', 5, 'Full House Deep Cleaning',
 'Booked them for pre-festival cleaning. Five cleaners arrived with proper uniform and gear. Every nook and corner was inspected and cleaned. Will hire them regularly!', true, NOW() - INTERVAL '35 days'),

('Meera Raj', 'Vellayambalam, Trivandrum', 5, 'Garden & Yard Clearing',
 'Overgrown weeds and coconut fronds removed quickly and neatly loaded away. Honest pricing with no hidden charges. Very transparent service.', true, NOW() - INTERVAL '40 days'),

('Harikrishnan N.', 'Pettah, Thiruvananthapuram', 5, 'Floor Scrubbing & Polishing',
 'Our Kota stone flooring had become dull over 10 years. Single disc scrubbing brought back a rich, clean finish. Really impressed by the modern machinery they use.', true, NOW() - INTERVAL '45 days'),

('Blessy Thomas', 'Kanjirampara, Thiruvananthapuram', 5, 'Bed Bugs Treatment',
 'We were struggling with bed bugs in guest room mattresses for months. Two rounds of treatment completely resolved the problem. Professional and empathetic team.', true, NOW() - INTERVAL '50 days');

-- 4. BLOG POSTS SEED (Rich SEO-targeted local articles)
INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, category, tags, author, published, meta_title, meta_description, published_at) VALUES
('deep-cleaning-checklist-for-kerala-homes',
 'Deep Cleaning Checklist for Kerala Homes: Ultimate Room-by-Room Guide',
 'From combating high coastal humidity to tackling hard water stains on tiles, here is the complete checklist tailored for Kerala residences.',
 '# The Complete Deep Cleaning Checklist for Kerala Homes

Maintaining a home in Kerala comes with unique environmental challenges: tropical humidity above 80%, seasonal monsoons, red soil dust, and hard borewell water. A routine mop and sweep isn''t enough to keep hidden mildew, grease, and calcium scale at bay.

Here is the professional room-by-room deep cleaning checklist formulated by PLAN C Cleaning Solutions.

---

## 1. Living Room & Common Areas
- **Ceiling Fans & Light Fixtures**: Wipe blades with anti-static microfiber cloth; wash glass chandelier shades.
- **Window Sills & Mosquito Meshes**: Unclip nylon meshes and wash with mild detergent; vacuum window sliders.
- **Curtains & Blinds**: Steam vacuum heavy draperies or launder sheer curtains.
- **Sofa & Upholstery**: Vacuum crevice areas under cushions; opt for injection-extraction shampooing every 6 months to eliminate dust mites.

## 2. Kitchen & Pantry
- **Chimney & Exhaust Blower**: Kerala cuisine involves generous use of coconut oil and spices, forming sticky greasy crusts. Soak baffle filters in warm caustic/degreaser solutions.
- **Behind Refrigerators & Heavy Appliances**: Pull out appliances to scrub accumulated cobwebs, pet hair, and oil vapor films.
- **Modular Cabinets**: Empty shelves, wipe inner laminate linings, and apply insect repellent gel in corner hinges.
- **Tile Grout Lines**: Use neutral pH tile cleaners to dissolve dark grease lines between tiles without eroding grout.

## 3. Bathrooms & Washrooms
- **Hard Water Descaling**: Kerala borewell water leaves chalky white and yellow mineral rings on taps, showers, and ceramic washbasins. Use non-hydrochloric descaling agents.
- **Exhaust Vent Scrubbing**: Clear moisture buildup and lint from bathroom ventilation grilles.
- **Floor Tile Scrubbing**: Rotary mechanized scrubbing restores anti-skid floor texture and destroys black slime.

## 4. Water Tank & Exterior Areas
- Clean overhead Sintex/concrete water tanks twice a year to prevent sediment and bacterial biofilm.
- High-pressure wash outdoor interlock pathways before and after the South-West monsoon.

> **Need hands-on help?** PLAN C Cleaning Solutions provides comprehensive house deep cleaning across Thiruvananthapuram, Kowdiar, Pattom, Kazhakkoottam, and nearby towns. Call **7994342372** for a free site assessment.',
 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
 'Home Cleaning',
 ARRAY['Deep Cleaning', 'Kerala Homes', 'Trivandrum', 'Home Maintenance'],
 'PLAN C Technical Crew',
 true,
 'Deep Cleaning Checklist for Kerala Homes | PLAN C Cleaning',
 'Complete room-by-room deep cleaning guide for homes in Thiruvananthapuram and Kerala. Expert tips for tackling humidity, hard water stains, and kitchen grease.',
 NOW() - INTERVAL '2 days'),

('how-to-prevent-termites-in-kerala-humid-climate',
 'How to Prevent Termites in Kerala''s Humid Climate: An Expert Guide',
 'Subterranean termites thrive in Kerala''s red soil and heavy moisture. Learn the early warning indicators and professional defense barriers.',
 '# How to Prevent Termites in Kerala''s Humid Climate

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

> **Protect your dream home**: PLAN C Pest Control provides certified anti-termite treatments across Thiruvananthapuram and Kollam with up to 5 years guarantee. Call **7994342372** to book an inspection.',
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
 'Pest Control',
 ARRAY['Termite Control', 'Pest Prevention', 'Kerala Climate', 'Home Care'],
 'PLAN C Pest Control Specialist',
 true,
 'Termite Prevention Guide for Kerala Homes | PLAN C Pest Control',
 'Learn how to detect and prevent subterranean termites in Kerala. Expert advice on termite barriers, mud tube detection, and long-term warranties.',
 NOW() - INTERVAL '5 days'),

('how-often-should-you-clean-your-water-tank',
 'How Often Should You Clean Your Water Tank in Kerala?',
 'Drinking water safety is paramount. Discover why seasonal sediment buildup necessitates bi-annual 6-stage mechanized tank sanitisation.',
 '# How Often Should You Clean Your Water Tank in Kerala?

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

PLAN C''s 6-Stage Mechanized Protocol:
1. **Deep Dewatering**: Specialized submersible pumps drain old stagnant water.
2. **Sludge Extraction**: Industrial wet vacuum cleaners suck out thick bottom muck.
3. **High-Pressure Rotary Jet Wash**: Strips stubborn algae and mineral crusts from wall corners.
4. **Vacuum Residue Clearing**: Clears all dislodged debris completely.
5. **Anti-Bacterial Spraying**: Safe, food-grade eco-friendly disinfectant sanitizes all surfaces.
6. **UV Radiator Sterilization**: High-intensity ultraviolet lamp kills any remaining floating spores.

> **Ensure 100% pure tap water for your family**: Book our 6-stage water tank sanitisation service in Trivandrum today at **7994342372**.',
 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1200&q=80',
 'Water Tank Hygiene',
 ARRAY['Water Tank Cleaning', 'Health & Safety', 'Thiruvananthapuram', 'Pure Water'],
 'PLAN C Technical Crew',
 true,
 'Water Tank Cleaning Frequency & Hygiene in Kerala | PLAN C',
 'How often should you clean overhead tanks and sumps in Kerala? Discover the 6-stage mechanized cleaning procedure by PLAN C Cleaning Solutions.',
 NOW() - INTERVAL '8 days'),

('bed-bug-removal-what-actually-works',
 'Bed Bug Removal in Kerala: What Actually Works (and What Fails)',
 'Tired of ineffective camphor and petrol hacks? Here is the scientific approach to eliminating bed bugs permanently from mattresses and furniture.',
 '# Bed Bug Removal: What Actually Works (and What Fails)

Bed bug infestations are on the rise across Kerala, particularly in rental apartments, university hostels, and frequently traveled family homes in Trivandrum, Kochi, and Kozhikode.

Because bed bug eggs are microscopic and resistant to ordinary pesticide sprays, homemade hacks rarely eliminate the colony.

---

## Popular DIY Hacks That Fail
- **Camphor (*Karpooram*)**: May temporarily repel bugs from a single pillow, but pushes the colony into nearby wardrobe crevices and electrical sockets.
- **Kerosene / Petrol**: Highly flammable, produces hazardous toxic fumes, stains mattresses, and does not kill bed bug eggs.
- **Sun-Drying Mattresses**: In Kerala''s humid air, outdoor sunlight rarely raises the mattress core temperature above the 55°C required to kill eggs nested 4 inches deep.

## What Science & Professional IPM Recommends

### 1. High-Heat Thermal Steam Treatment
Bed bugs and their eggs die instantly when exposed to temperatures exceeding 60°C. Professional steam cleaners inject 140°C dry steam into mattress tufts, seams, headboard slots, and sofa joints without soaking the fabric.

### 2. Dual-Visit Chemical Treatment
Pesticides kill crawling adults and nymphs, but unhatched eggs remain protected by their protective shell. Therefore, a professional service **must include a second round after 12-15 days** to target newly hatched nymphs before they reach reproductive maturity.

### 3. Mattress Encasement & Room Prep
Wash all bed sheets, blankets, and pillow covers in hot water (above 60°C). Vacuum headboards and seal cracks along wall baseboards.

> **Sleep peacefully again without bites**: Contact PLAN C Pest Control for discreet, guaranteed bed bug eradication in Thiruvananthapuram. Call **7994342372**.',
 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?auto=format&fit=crop&w=1200&q=80',
 'Pest Control',
 ARRAY['Bed Bug Treatment', 'Pest Control Kerala', 'Sleep Hygiene', 'Disinfection'],
 'PLAN C Technical Crew',
 true,
 'Bed Bug Removal in Kerala: Complete Eradication Guide | PLAN C',
 'Discover why DIY bed bug hacks fail and how PLAN C''s thermal steam and targeted pest control eliminates bed bugs completely.',
 NOW() - INTERVAL '11 days'),

('monsoon-cleaning-tips-for-thiruvananthapuram-homes',
 'Monsoon Cleaning Tips for Thiruvananthapuram Homes',
 'Prepare your home against slippery moss, black fungal mildew, damp closets, and roof drain clogs during Kerala rains.',
 '# Monsoon Cleaning Tips for Thiruvananthapuram Homes

The monsoon in Kerala brings lush greenery and cool weather, but also brings constant humidity, mud splatter, musty odors, and treacherous green moss on outdoor tiles.

Here is how you can safeguard your home before and during the monsoon season.

---

## 1. Eliminate Slippery Interlock Algae Early
Kerala''s heavy showers quickly turn interlock pavers, car porches, and granite steps into slip hazards. High-pressure jet washing removes the slime layer deep in the concrete pores. Applying an anti-fungal wash ensures moss doesn''t reappear after the next rainfall.

## 2. Fight Fungus and Mildew in Wardrobes
Keep camphor tablets, silica gel packets, or moisture absorber boxes inside wooden wardrobes to stop mold from growing on leather shoes, cotton sarees, and coats. Wipe interior cabinet walls with a diluted vinegar-water solution every fortnight.

## 3. Clear Roof Gutters & Rainwater Inlets
Dead leaves, coconut fronds, and dirt block roof drain pipes, causing water stagnation and terrace seepage. Clean your terrace spouts and gutters before the torrential rains begin.

## 4. Ward Off Monsoon Pests
The wet ground drives cockroaches, centipedes, and rodents indoors seeking shelter and food. Seal pipe inlets under sinks and schedule preventative pest control before the season sets in.

> **Prepare your home for the rains**: PLAN C offers customized pre-monsoon and post-monsoon deep cleaning packages in Thiruvananthapuram. Call **7994342372** today.',
 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
 'Seasonal Cleaning',
 ARRAY['Monsoon Cleaning', 'Trivandrum', 'Outdoor Cleaning', 'Mold Prevention'],
 'PLAN C Editorial Team',
 true,
 'Monsoon Cleaning Tips for Thiruvananthapuram Homes | PLAN C',
 'Keep your house safe from mold, slippery moss, and pests during Kerala rains with these professional monsoon cleaning tips.',
 NOW() - INTERVAL '14 days');

-- 5. SAMPLE BOOKINGS (For admin overview and tracking demonstration)
INSERT INTO bookings (booking_code, name, email, phone, service_name, address, preferred_date, message, status, assigned_team, admin_notes) VALUES
('PC-2025-0001', 'Anand Krishnan', 'anand.k@example.com', '9847123456', 'Full House Deep Cleaning', 'TC 14/1205, Jawahar Nagar, Kowdiar, Thiruvananthapuram', CURRENT_DATE + INTERVAL '2 days', 'Need deep cleaning before housewarming ceremony. 3BHK villa.', 'Confirmed', 'Unit A - Lead: Suresh', 'Customer requested morning 8:30 AM arrival.'),
('PC-2025-0002', 'Revathi Chandran', 'revathi.c@example.com', '9745678901', 'Water Tank & Sump Cleaning', 'Flat 4B, Heera Towers, Pattom, Trivandrum', CURRENT_DATE + INTERVAL '1 day', 'Underground sump 4000L and overhead 1000L tank cleaning.', 'In progress', 'Unit C - Lead: Rajesh', 'Technicians on route with jet pumps.'),
('PC-2025-0003', 'Dr. Thomas George', 'dr.thomas@example.com', '9447112233', 'General Pest Control', 'Villa 12, Technopark Enclave, Kazhakkoottam', CURRENT_DATE + INTERVAL '4 days', 'Cockroach and ant treatment in kitchen and store room.', 'Pending', 'Unit B - Lead: Dileep', 'Pending customer confirmation on Saturday slot.'),
('PC-2025-0004', 'Deepa Jayakumar', 'deepa.j@example.com', '9895001122', 'Sofa, Mattress & Carpet Shampooing', 'Devi Kripa, Thrikannapuram, Thiruvananthapuram', CURRENT_DATE - INTERVAL '1 day', 'L-shaped fabric sofa shampooing and stain removal.', 'Completed', 'Unit A - Lead: Suresh', 'Service completed successfully. Customer left 5 star review.')
ON CONFLICT (booking_code) DO NOTHING;

