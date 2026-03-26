export type Category =
  | "Fruits & Vegetables"
  | "Bakery"
  | "Dairy & Eggs"
  | "Meat & Seafood"
  | "Pantry"
  | "Beverages";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "apple-gala-1kg",
    name: "Gala Apples (1kg)",
    price: 3.49,
    category: "Fruits & Vegetables",
    image:
       "/apple-gala-1kg.jpg",
    description:
      "Crisp, sweet Gala apples perfect for snacking, juicing, or baking.",
    badge: "Fresh"
  },
  {
    id: "banana-1kg",
    name: "Bananas (1kg)",
    price: 2.19,
    category: "Fruits & Vegetables",
    image:
      "https://images.pexels.com/photos/461208/pexels-photo-461208.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Perfectly ripe bananas packed with natural energy and potassium.",
    badge: "Best Seller"
  },
  {
    id: "spinach-bag",
    name: "Baby Spinach (Bag)",
    price: 2.99,
    category: "Fruits & Vegetables",
    image: "/spinach-bag.jpg",
    description:
      "Tender baby spinach leaves, washed and ready to use in salads or smoothies.",
    badge: "Organic"
  },
  {
    id: "sourdough-loaf",
    name: "Artisan Sourdough Loaf",
    price: 4.99,
    category: "Bakery",
    image: "/sourdough-loaf.jpg",
    description:
      "Crusty artisan sourdough with a soft, airy crumb and tangy flavor.",
    badge: "Freshly Baked"
  },
  {
    id: "croissant-pack",
    name: "Butter Croissants (4-pack)",
    price: 5.49,
    category: "Bakery",
    image: "/croissant-pack.jpg",
    description:
      "Flaky, buttery croissants baked to golden perfection. Ideal for breakfast.",
    badge: "Limited"
  },
  {
    id: "free-range-eggs",
    name: "Free-Range Eggs (12)",
    price: 4.29,
    category: "Dairy & Eggs",
    image:
      "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Farm-fresh free-range eggs with rich golden yolks and firm whites.",
    badge: "Customer Favorite"
  },
  {
    id: "whole-milk",
    name: "Whole Milk (1L)",
    price: 1.89,
    category: "Dairy & Eggs",
    image: "/whole-milk.jpg",
    description:
      "Creamy whole milk sourced from local farms, perfect for cereal and coffee."
  },
  {
    id: "salmon-fillets",
    name: "Atlantic Salmon Fillets (400g)",
    price: 9.99,
    category: "Meat & Seafood",
    image: "/salmon-fillets.jpg",
    description:
      "Skin-on salmon fillets, rich in omega-3 fatty acids and flavor.",
    badge: "Fresh"
  },
  {
    id: "chicken-breast",
    name: "Chicken Breast (500g)",
    price: 7.49,
    category: "Meat & Seafood",
    image:
      "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Lean, boneless, skinless chicken breast ideal for grilling or roasting."
  },
  {
    id: "olive-oil",
    name: "Extra Virgin Olive Oil (500ml)",
    price: 8.99,
    category: "Pantry",
    image: "/olive-oil.jpg",
    description:
      "Cold-pressed extra virgin olive oil with a smooth, fruity flavor.",
    badge: "Pantry Essential"
  },
  {
    id: "pasta-penne",
    name: "Penne Pasta (500g)",
    price: 1.59,
    category: "Pantry",
    image:
      "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Premium durum wheat penne pasta that cooks to a perfect al dente bite."
  },
  {
    id: "orange-juice",
    name: "Cold-Pressed Orange Juice (1L)",
    price: 4.49,
    category: "Beverages",
    image:
      "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Bright and refreshing cold-pressed orange juice with no added sugar.",
    badge: "No Added Sugar"
  },
  {
    id: "grapes-seedless-500g",
    name: "Seedless Grapes (500g)",
    price: 3.99,
    category: "Fruits & Vegetables",
    image:
      "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Crisp, juicy seedless grapes ideal for snacking, salads, and kids' lunch boxes.",
    badge: "In Season"
  },
  {
    id: "tomatoes-vine-1kg",
    name: "Vine Tomatoes (1kg)",
    price: 2.89,
    category: "Fruits & Vegetables",
    image:
      "https://images.pexels.com/photos/8390/food-wood-tomatoes.jpg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Bright red vine-ripened tomatoes with a rich, full flavor for salads and sauces.",
    badge: "Chef's Choice"
  },
  {
    id: "cucumbers-mini-pack",
    name: "Mini Cucumbers (Pack)",
    price: 2.49,
    category: "Fruits & Vegetables",
    image: "/cucumbers-mini-pack.jpg",
    description:
      "Crunchy mini cucumbers perfect for snacking, salads, and lunch boxes.",
    badge: "Snack Size"
  },
  {
    id: "lettuce-romaine-head",
    name: "Romaine Lettuce (Head)",
    price: 1.99,
    category: "Fruits & Vegetables",
    image: "/lettuce-romaine-head.jpg",
    description:
      "Crisp romaine lettuce leaves, ideal for Caesar salads and healthy wraps."
  },
  {
    id: "yogurt-greek-plain",
    name: "Greek Yogurt Plain (500g)",
    price: 3.59,
    category: "Dairy & Eggs",
    image: "/yogurt-greek-plain.jpg",
    description:
      "Thick and creamy plain Greek yogurt, high in protein and perfect with fruit.",
    badge: "High Protein"
  },
  {
    id: "cheddar-cheese-block",
    name: "Mature Cheddar Cheese (Block)",
    price: 5.29,
    category: "Dairy & Eggs",
    image:
     "/Greek-Yogurt-Plain.jpg",
    description:
      "Rich and tangy mature cheddar cheese, ideal for sandwiches and baking."
  },
  {
    id: "butter-unsalted-250g",
    name: "Unsalted Butter (250g)",
    price: 3.19,
    category: "Dairy & Eggs",
    image:
    "/Unsalted-Butter.jpg",
    description:
      "Creamy unsalted butter, perfect for baking and cooking where you control the salt."
  },
  {
    id: "rice-basmati-1kg",
    name: "Basmati Rice (1kg)",
    price: 4.79,
    category: "Pantry",
    image:
     "/Basmati-Rice.jpg",
    description:
      "Long-grain aromatic basmati rice that cooks light and fluffy every time.",
    badge: "Family Pack"
  },
  {
    id: "lentils-red-500g",
    name: "Red Lentils (500g)",
    price: 2.39,
    category: "Pantry",
    image:
      "/red-lentiles.jpg",
    description:
      "Split red lentils that cook quickly, perfect for dals, soups, and stews."
  },
  {
    id: "cereal-honey-crunch",
    name: "Honey Crunch Cereal",
    price: 4.19,
    category: "Pantry",
    image:
       "/Honey-Crunch- Cereal.jpg",
    description:
      "Light, crunchy cereal clusters with a hint of honey for an easy breakfast."
  },
  {
    id: "coffee-ground-medium-roast",
    name: "Ground Coffee Medium Roast (250g)",
    price: 6.49,
    category: "Beverages",
    image:
      "https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Balanced medium-roast ground coffee with notes of caramel and chocolate."
  },
  {
    id: "tea-green-40bags",
    name: "Green Tea (40 bags)",
    price: 3.29,
    category: "Beverages",
    image:
      "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Smooth and refreshing green tea packed in convenient, individually wrapped bags."
  },
  {
    id: "water-spring-6pack",
    name: "Spring Water (6x1.5L)",
    price: 5.59,
    category: "Beverages",
    image:
       "/Spring-Water.jpg",
    description:
      "Natural spring water in a handy 6-pack to keep you hydrated throughout the week."
  },
  {
    id: "soda-cola-4pack",
    name: "Cola Drink (4x330ml)",
    price: 3.49,
    category: "Beverages",
    image:
      "/Cola-Drink.jpg",
    description:
      "Classic cola soft drink multipack, lightly sparkling and ready to serve chilled."
  },
  {
    id: "cookies-chocolate-chip",
    name: "Chocolate Chip Cookies",
    price: 2.99,
    category: "Pantry",
    image:
      "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Soft-baked chocolate chip cookies with generous chunks of real chocolate.",
    badge: "Treat"
  },
  {
    id: "chips-sea-salt",
    name: "Sea Salt Potato Chips",
    price: 2.49,
    category: "Pantry",
    image:
       "/chips-sea-salt.jpg",
    description:
      "Kettle-cooked potato chips seasoned with natural sea salt for a satisfying crunch."
  }
];

export const categories: Category[] = [
  "Fruits & Vegetables",
  "Bakery",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Pantry",
  "Beverages"
];

