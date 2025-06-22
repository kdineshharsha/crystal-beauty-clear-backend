import mongoose from "mongoose";
import Product from "../models/product.js";

const products = [
  {
    productId: "CSM031",
    name: "Hydra Boost Facial Cleanser",
    altNames: ["Face Wash", "Gentle Cleanser"],
    description:
      "A mild foaming cleanser that removes dirt and impurities without drying.",
    price: 1700,
    labeledPrice: 1900,
    image: ["https://images.unsplash.com/photo-1620842176087-19e4d25f52e1"],
    stock: 45,
    category: "skincare",
  },
  {
    productId: "CSM032",
    name: "Matte Finish Compact Powder",
    altNames: ["Pressed Powder", "Oil Control Powder"],
    description:
      "Compact powder with matte finish that controls shine for hours.",
    price: 1500,
    labeledPrice: 1700,
    image: ["https://images.unsplash.com/photo-1620842176111-1f8e68257b87"],
    stock: 30,
    category: "face",
  },
  {
    productId: "CSM033",
    name: "Aloe Vera Soothing Gel",
    altNames: ["Skin Soothing Gel", "Natural Gel"],
    description:
      "Multi-purpose aloe vera gel for face, body, and hair hydration.",
    price: 1100,
    labeledPrice: 1300,
    image: ["https://images.unsplash.com/photo-1599916210664-d5bc8b355320"],
    stock: 50,
    category: "skincare",
  },
  {
    productId: "CSM034",
    name: "Longwear Liquid Eyeliner",
    altNames: ["Liquid Liner", "Smudgeproof Eyeliner"],
    description: "Intense black eyeliner with precision tip for sharp lines.",
    price: 1200,
    labeledPrice: 1400,
    image: ["https://images.unsplash.com/photo-1588776814546-62adf72ee8f1"],
    stock: 38,
    category: "eye",
  },
  {
    productId: "CSM035",
    name: "Bubblegum Lip Scrub",
    altNames: ["Exfoliating Lip Scrub", "Sugar Lip Scrub"],
    description:
      "Gentle exfoliator that removes dead skin and leaves lips baby-soft.",
    price: 950,
    labeledPrice: 1150,
    image: ["https://images.unsplash.com/photo-1599942163743-229e84b04c31"],
    stock: 55,
    category: "lips",
  },
  {
    productId: "CSM036",
    name: "Hydrating Facial Toner",
    altNames: ["Pore Tightener", "Refreshing Toner"],
    description: "Alcohol-free toner that balances skin pH and reduces pores.",
    price: 1400,
    labeledPrice: 1600,
    image: ["https://images.unsplash.com/photo-1599058917213-8ac97ed8758e"],
    stock: 42,
    category: "skincare",
  },
  {
    productId: "CSM037",
    name: "Nude Glam Lipstick Set",
    altNames: ["Lip Kit", "Nude Lip Shades"],
    description:
      "Set of 3 creamy matte lipsticks in universally flattering nude tones.",
    price: 2900,
    labeledPrice: 3300,
    image: ["https://images.unsplash.com/photo-1618740197283-c6ee5f1f3a1b"],
    stock: 22,
    category: "lips",
  },
  {
    productId: "CSM038",
    name: "Cocoa Butter Hand Cream",
    altNames: ["Hand Lotion", "Moisturizing Cream"],
    description:
      "Deeply moisturizing cream that nourishes dry hands without greasiness.",
    price: 1000,
    labeledPrice: 1200,
    image: ["https://images.unsplash.com/photo-1607082340916-9aaebf59bb9a"],
    stock: 60,
    category: "skincare",
  },
  {
    productId: "CSM039",
    name: "Plumping Lip Gloss",
    altNames: ["Shiny Lip Gloss", "Volumizing Lip Gloss"],
    description:
      "High-shine gloss with a tingle that visibly plumps your lips.",
    price: 1250,
    labeledPrice: 1400,
    image: ["https://images.unsplash.com/photo-1634121352015-645b8ea2e5e3"],
    stock: 48,
    category: "lips",
  },
  {
    productId: "CSM040",
    name: "Chamomile Calming Sheet Mask",
    altNames: ["Relaxing Face Mask", "Chamomile Mask"],
    description:
      "Soothing sheet mask with chamomile extract to calm irritated skin.",
    price: 850,
    labeledPrice: 1000,
    image: ["https://images.unsplash.com/photo-1617957747275-3be7c7726baf"],
    stock: 58,
    category: "skincare",
  },
  {
    productId: "CSM041",
    name: "Volcanic Clay Face Pack",
    altNames: ["Clay Mask", "Detox Face Pack"],
    description: "Deep-cleansing mask that absorbs oil and clears blackheads.",
    price: 1600,
    labeledPrice: 1800,
    image: ["https://images.unsplash.com/photo-1629903257761-75aa6c1180ef"],
    stock: 34,
    category: "face",
  },
  {
    productId: "CSM042",
    name: "Waterproof Brow Pomade",
    altNames: ["Brow Cream", "Eyebrow Filler"],
    description: "Creamy formula for sculpted brows with waterproof hold.",
    price: 1300,
    labeledPrice: 1500,
    image: ["https://images.unsplash.com/photo-1616744922486-c79ab60f63ec"],
    stock: 29,
    category: "eye",
  },
  {
    productId: "CSM043",
    name: "Satin Finish Blush",
    altNames: ["Cheek Color", "Powder Blush"],
    description: "Buildable blush that delivers a healthy satin glow.",
    price: 1400,
    labeledPrice: 1650,
    image: ["https://images.unsplash.com/photo-1588776814652-40f3c4a3d82c"],
    stock: 38,
    category: "face",
  },
  {
    productId: "CSM044",
    name: "Cuticle Revive Oil",
    altNames: ["Nail Oil", "Cuticle Treatment"],
    description:
      "Nourishing oil blend to soften cuticles and strengthen nails.",
    price: 950,
    labeledPrice: 1100,
    image: ["https://images.unsplash.com/photo-1620842175700-1f09b63a04a9"],
    stock: 46,
    category: "nail",
  },
  {
    productId: "CSM045",
    name: "Soft Matte Liquid Lipstick",
    altNames: ["Liquid Lip", "Longwear Lipstick"],
    description:
      "Transfer-proof matte liquid lipstick with intense color payoff.",
    price: 1600,
    labeledPrice: 1850,
    image: ["https://images.unsplash.com/photo-1620842176049-c9d1275bb538"],
    stock: 50,
    category: "lips",
  },
  {
    productId: "CSM046",
    name: "Night Repair Face Cream",
    altNames: ["Night Moisturizer", "Overnight Repair Cream"],
    description:
      "Rich cream that repairs and rejuvenates your skin while you sleep.",
    price: 2700,
    labeledPrice: 3000,
    image: ["https://images.unsplash.com/photo-1588776814676-0c5cf77b6375"],
    stock: 32,
    category: "skincare",
  },
  {
    productId: "CSM047",
    name: "Sunkissed Bronzer Powder",
    altNames: ["Bronzing Powder", "Contour Powder"],
    description:
      "A warm bronzer that enhances natural glow and contours your face.",
    price: 1500,
    labeledPrice: 1700,
    image: ["https://images.unsplash.com/photo-1600185365447-67df47e2f63e"],
    stock: 39,
    category: "face",
  },
  {
    productId: "CSM048",
    name: "Smokey Eyeshadow Palette",
    altNames: ["Eye Palette", "Smokey Tones"],
    description: "A 9-shade palette perfect for day-to-night smokey eye looks.",
    price: 2400,
    labeledPrice: 2700,
    image: ["https://images.unsplash.com/photo-1616744971244-b97d0e1b3641"],
    stock: 25,
    category: "eye",
  },
  {
    productId: "CSM049",
    name: "Vanilla Kiss Fragrance Mist",
    altNames: ["Perfume Mist", "Sweet Fragrance"],
    description: "Delicate vanilla-scented mist for sweet and cozy vibes.",
    price: 1900,
    labeledPrice: 2200,
    image: ["https://images.unsplash.com/photo-1600185365620-ef61f29e01ed"],
    stock: 28,
    category: "fragrance",
  },
  {
    productId: "CSM050",
    name: "Caffeine Eye Serum",
    altNames: ["Under Eye Serum", "Dark Circle Serum"],
    description:
      "Reduces puffiness and brightens the under-eye area with caffeine and peptides.",
    price: 2000,
    labeledPrice: 2300,
    image: ["https://images.unsplash.com/photo-1608471586071-b4cb12b7e55c"],
    stock: 36,
    category: "skincare",
  },
];

const MONGODB_URI =
  "mongodb+srv://admin:dineshharsha182@cluster0.2p40u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // 🔁 update with your DB name

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("💾 Connected to MongoDB");

    await Product.insertMany(products);
    console.log("🌸 New products seeded successfully");

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
  }
}

seedDatabase();
