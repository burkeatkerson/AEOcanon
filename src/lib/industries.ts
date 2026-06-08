/**
 * Industry taxonomy — local-business families and their verticals, mirroring
 * design/templates/industries.html. Each vertical is an "industry hub": a
 * self-contained content library (guides, teardowns, query maps, templates)
 * for one trade. A vertical's live/article-count status is computed from real
 * content (see src/lib/content.ts), so the catalog stays honest.
 */

export interface IndustryVertical {
  slug: string;
  name: string;
}

export interface IndustryFamily {
  id: string;
  letter: string;
  name: string;
  /** CSS var for the family accent. */
  color: string;
  verticals: IndustryVertical[];
}

export const FAMILIES: IndustryFamily[] = [
  {
    id: "home",
    letter: "A",
    name: "Home & Property Services",
    color: "var(--c5)",
    verticals: [
      { slug: "hvac", name: "HVAC / Heating & Cooling" },
      { slug: "plumbing", name: "Plumbing" },
      { slug: "electrical", name: "Electrical" },
      { slug: "roofing", name: "Roofing" },
      { slug: "landscaping", name: "Landscaping & Lawn Care" },
      { slug: "pest-control", name: "Pest Control" },
      { slug: "garage-doors", name: "Garage Doors" },
      { slug: "pool-spa", name: "Pool & Spa Service" },
      { slug: "house-cleaning", name: "House Cleaning" },
      { slug: "window-gutter", name: "Window & Gutter" },
      { slug: "painting", name: "Painting" },
    ],
  },
  {
    id: "trades",
    letter: "B",
    name: "Construction & Trades",
    color: "var(--c4)",
    verticals: [
      { slug: "general-contractors", name: "General Contractors" },
      { slug: "remodeling", name: "Remodeling & Renovation" },
      { slug: "concrete-masonry", name: "Concrete & Masonry" },
      { slug: "fencing-decks", name: "Fencing & Decks" },
      { slug: "flooring", name: "Flooring" },
      { slug: "solar", name: "Solar Installers" },
      { slug: "handyman", name: "Handyman Services" },
      { slug: "excavation", name: "Excavation & Grading" },
    ],
  },
  {
    id: "auto",
    letter: "C",
    name: "Auto & Transport",
    color: "var(--c1)",
    verticals: [
      { slug: "auto-repair", name: "Auto Repair & Mechanics" },
      { slug: "auto-detailing", name: "Auto Detailing" },
      { slug: "tire-wheel", name: "Tire & Wheel Shops" },
      { slug: "towing", name: "Towing & Roadside" },
      { slug: "moving", name: "Moving Companies" },
      { slug: "mobile-mechanics", name: "Mobile Mechanics" },
      { slug: "auto-glass", name: "Auto Glass" },
    ],
  },
  {
    id: "local",
    letter: "D",
    name: "Local & Personal Services",
    color: "var(--c6)",
    verticals: [
      { slug: "salons", name: "Salons & Barbershops" },
      { slug: "tattoo", name: "Tattoo Studios" },
      { slug: "pet-grooming", name: "Pet Grooming" },
      { slug: "dog-training", name: "Dog Training & Boarding" },
      { slug: "photographers", name: "Photographers" },
      { slug: "event-services", name: "DJs & Event Services" },
      { slug: "maid-services", name: "Cleaning & Maid Services" },
      { slug: "locksmiths", name: "Locksmiths" },
    ],
  },
  {
    id: "fitness",
    letter: "E",
    name: "Fitness & Recreation",
    color: "var(--c3)",
    verticals: [
      { slug: "gyms", name: "Gyms & Studios" },
      { slug: "personal-trainers", name: "Personal Trainers" },
      { slug: "yoga-pilates", name: "Yoga & Pilates" },
      { slug: "martial-arts", name: "Martial Arts Dojos" },
      { slug: "sports-instruction", name: "Golf & Sports Instruction" },
      { slug: "rec-centers", name: "Climbing & Rec Centers" },
    ],
  },
  {
    id: "food",
    letter: "F",
    name: "Food & Hospitality",
    color: "var(--c2)",
    verticals: [
      { slug: "restaurants", name: "Restaurants" },
      { slug: "cafes", name: "Cafés & Coffee Shops" },
      { slug: "caterers", name: "Caterers" },
      { slug: "food-trucks", name: "Food Trucks" },
      { slug: "breweries", name: "Breweries & Taprooms" },
      { slug: "bakeries", name: "Bakeries" },
    ],
  },
  {
    id: "professional",
    letter: "G",
    name: "Professional & B2B Services",
    color: "var(--accent-2)",
    verticals: [
      { slug: "marketing-agencies", name: "Marketing & Creative Agencies" },
      { slug: "it-services", name: "IT Services & MSPs" },
      { slug: "web-design", name: "Web Designers & Devs" },
      { slug: "bookkeeping", name: "Bookkeeping & Tax Prep" },
      { slug: "consultants", name: "Business Consultants" },
      { slug: "commercial-cleaning", name: "Commercial Cleaning" },
      { slug: "staffing", name: "Staffing & Recruiting" },
      { slug: "print-sign", name: "Print & Sign Shops" },
    ],
  },
  {
    id: "retail",
    letter: "H",
    name: "Retail & Specialty",
    color: "var(--accent)",
    verticals: [
      { slug: "florists", name: "Florists" },
      { slug: "boutiques", name: "Boutiques & Apparel" },
      { slug: "jewelers", name: "Jewelers" },
      { slug: "furniture", name: "Furniture & Home Goods" },
      { slug: "hobby-shops", name: "Specialty Hobby Shops" },
    ],
  },
];

/** Every vertical slug — the closed set article frontmatter validates against. */
export const INDUSTRY_SLUGS = FAMILIES.flatMap((f) =>
  f.verticals.map((v) => v.slug),
) as [string, ...string[]];

const VERTICAL_INDEX = new Map(
  FAMILIES.flatMap((f) =>
    f.verticals.map((v) => [v.slug, { vertical: v, family: f }] as const),
  ),
);

export function findVertical(slug: string) {
  return VERTICAL_INDEX.get(slug);
}

export function industryName(slug: string): string {
  return VERTICAL_INDEX.get(slug)?.vertical.name ?? slug;
}
