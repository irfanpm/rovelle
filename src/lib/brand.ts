export const categories = [
  { slug: "necklaces", name: "Necklaces", caption: "A little closer to your heart", icon: "necklace" },
  { slug: "earrings", name: "Earrings", caption: "Details that make a difference", icon: "earring" },
  { slug: "jewellery-sets", name: "Jewellery Sets", caption: "Beautifully brought together", icon: "gem" },
  { slug: "daily-wear", name: "Daily Wear", caption: "For your everyday moments", icon: "sparkles" },
  { slug: "party-wear", name: "Party Wear", caption: "For a moment to remember", icon: "flower" },
  { slug: "new-arrivals", name: "New Arrivals", caption: "Something new to fall for", icon: "gift" },
];
export const isJewelleryCategory = (slug: string) => categories.some(c => c.slug === slug);
// Keep the original publication categories available to the existing sourcing workflow.
export const sourcingCategories = [...categories.filter(c => c.slug !== "new-arrivals"),
  {slug:"baby-toddler",name:"Baby & Toddler",caption:"For the littlest moments"},
  {slug:"toys-learning",name:"Toys & Learning",caption:"A little play. A lot of possibility."},
  {slug:"kids-fashion",name:"Kids Fashion",caption:"Everyday little favourites"},
  {slug:"school-essentials",name:"School Essentials",caption:"Ready for a new chapter"},
  {slug:"nursery-care",name:"Nursery & Care",caption:"Make room for growing up"},
];
export const categoryHref = (slug: string) => slug === "new-arrivals" ? "/products?new=1&edit=jewellery" : "/products?category=" + encodeURIComponent(slug);
export const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
