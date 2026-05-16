export type Ingredient = {
  item: string;
  amount: string;
};

export type Step = {
  text: string;
  time?: string; // e.g. "5 min"
};

export type Recipe = {
  id: string;
  title: string;
  subtitle: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  calories?: number;
  protein?: number;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  notes?: string[];
};

export const RECIPES: Recipe[] = [
  {
    id: "chicken-mushroom-pea-soup",
    title: "Chicken Mushroom Pea Soup",
    subtitle: "Creamy, high-protein, one-pot comfort",
    servings: 4,
    prepTime: "15 min",
    cookTime: "30 min",
    calories: 380,
    protein: 42,
    tags: ["high-protein", "one-pot", "meal-prep"],
    ingredients: [
      { item: "Chicken breast (diced)", amount: "600g" },
      { item: "Cremini mushrooms (sliced)", amount: "300g" },
      { item: "Frozen peas", amount: "200g" },
      { item: "Onion (diced)", amount: "1 medium" },
      { item: "Garlic (minced)", amount: "4 cloves" },
      { item: "Chicken stock", amount: "1 litre" },
      { item: "Heavy cream (or coconut cream)", amount: "150ml" },
      { item: "Butter", amount: "2 tbsp" },
      { item: "Olive oil", amount: "1 tbsp" },
      { item: "Fresh thyme (or 1 tsp dried)", amount: "3 sprigs" },
      { item: "Salt", amount: "to taste" },
      { item: "Black pepper", amount: "to taste" },
      { item: "Parmesan (optional, for serving)", amount: "grated" },
    ],
    steps: [
      { text: "Heat olive oil + butter in a large pot over medium-high. Season chicken with salt & pepper, sear until golden on all sides (don't cook through). Remove and set aside.", time: "5 min" },
      { text: "In the same pot, add mushrooms. Cook without moving for 2 min to get colour, then stir and cook until golden and liquid has evaporated.", time: "5 min" },
      { text: "Add onion, cook until softened. Add garlic + thyme, stir for 30 seconds until fragrant.", time: "3 min" },
      { text: "Pour in chicken stock, scrape up browned bits from the bottom. Bring to a simmer.", time: "2 min" },
      { text: "Return chicken to the pot. Simmer gently until chicken is cooked through.", time: "12 min" },
      { text: "Stir in frozen peas and cream. Simmer for 3 more minutes. Season to taste.", time: "3 min" },
      { text: "Serve in bowls, top with cracked pepper and parmesan if desired. Pair with garlic bread." },
    ],
    notes: [
      "Meal-prep friendly: keeps 4 days in fridge, freezes well (add peas after reheating).",
      "For extra thickness, mash half the peas before adding.",
      "Swap cream for coconut cream to keep it dairy-free (except butter — use oil).",
    ],
  },
  {
    id: "garlic-bread",
    title: "Garlic Bread",
    subtitle: "Crispy, buttery, goes with everything",
    servings: 4,
    prepTime: "5 min",
    cookTime: "10 min",
    calories: 220,
    protein: 5,
    tags: ["side", "quick"],
    ingredients: [
      { item: "Baguette or ciabatta", amount: "1 loaf" },
      { item: "Butter (softened)", amount: "80g" },
      { item: "Garlic (finely minced)", amount: "4 cloves" },
      { item: "Fresh parsley (chopped)", amount: "2 tbsp" },
      { item: "Salt", amount: "pinch" },
      { item: "Parmesan (optional)", amount: "2 tbsp grated" },
    ],
    steps: [
      { text: "Preheat oven to 200°C / 400°F." },
      { text: "Mix softened butter with garlic, parsley, salt, and parmesan until combined." },
      { text: "Slice baguette in half lengthwise. Spread butter mixture generously on both halves." },
      { text: "Place on a baking tray, cut-side up. Bake until edges are golden and butter is bubbling.", time: "8-10 min" },
      { text: "Slice into portions. Serve immediately alongside soup." },
    ],
    notes: [
      "For extra crunch: broil for the last 1-2 min (watch closely).",
      "Make ahead: prep the butter, store in fridge up to 3 days. Spread and bake when ready.",
    ],
  },
  {
    id: "cabbage-potato-egg-pancake",
    title: "Cabbage Potato Egg Pancake",
    subtitle: "Crispy, savory, cheap & filling",
    servings: 2,
    prepTime: "10 min",
    cookTime: "12 min",
    calories: 310,
    protein: 14,
    tags: ["quick", "vegetarian", "budget"],
    ingredients: [
      { item: "Green cabbage (grated)", amount: "2 cups" },
      { item: "Potato (peeled, grated)", amount: "1 large" },
      { item: "Eggs", amount: "3" },
      { item: "All-purpose flour", amount: "3 tbsp" },
      { item: "Salt", amount: "½ tsp" },
      { item: "Black pepper", amount: "¼ tsp" },
      { item: "Garlic powder (or 1 clove minced)", amount: "½ tsp" },
      { item: "Spring onion (sliced)", amount: "2 stalks" },
      { item: "Olive oil or butter", amount: "2 tbsp" },
      { item: "Sour cream or yoghurt (for serving)", amount: "optional" },
    ],
    steps: [
      { text: "Grate cabbage and potato. Squeeze out excess moisture with a clean towel — this is the key to crispiness." },
      { text: "In a bowl, whisk eggs. Add grated cabbage, potato, flour, salt, pepper, garlic powder, and spring onion. Mix until just combined." },
      { text: "Heat oil/butter in a large non-stick pan over medium heat.", time: "1 min" },
      { text: "Pour batter into pan, spread evenly to ~1cm thick. Press down gently with a spatula.", time: "1 min" },
      { text: "Cook undisturbed until bottom is golden and edges set.", time: "5-6 min" },
      { text: "Flip carefully (use a plate if needed). Cook second side until golden and crispy.", time: "4-5 min" },
      { text: "Slide onto a cutting board, slice into wedges. Serve with sour cream or yoghurt." },
    ],
    notes: [
      "Squeezing moisture out of the grated veg is non-negotiable — wet batter = soggy pancake.",
      "Add shredded cheese to the batter for extra richness.",
      "Works great as meal prep: reheat in a dry pan to re-crisp.",
    ],
  },
  {
    id: "overnight-oats-strawberry",
    title: "Strawberry Overnight Oats",
    subtitle: "No-cook, grab-and-go breakfast",
    servings: 1,
    prepTime: "5 min",
    cookTime: "0 min (overnight soak)",
    calories: 350,
    protein: 18,
    tags: ["meal-prep", "no-cook", "high-fiber"],
    ingredients: [
      { item: "Rolled oats", amount: "½ cup" },
      { item: "Greek yoghurt", amount: "⅓ cup" },
      { item: "Milk (any)", amount: "½ cup" },
      { item: "Chia seeds", amount: "1 tbsp" },
      { item: "Honey or maple syrup", amount: "1 tbsp" },
      { item: "Vanilla extract", amount: "½ tsp" },
      { item: "Fresh strawberries (sliced)", amount: "½ cup" },
      { item: "Pinch of salt", amount: "" },
    ],
    steps: [
      { text: "In a jar or container, combine oats, yoghurt, milk, chia seeds, honey, vanilla, and salt. Stir well." },
      { text: "Layer half the sliced strawberries into the mixture, gently fold in." },
      { text: "Cover and refrigerate overnight (minimum 4 hours)." },
      { text: "In the morning, stir. Top with remaining fresh strawberries. Eat cold straight from the jar." },
    ],
    notes: [
      "Keeps 3 days in the fridge — make a batch on Sunday night.",
      "Too thick in the morning? Splash in a little more milk and stir.",
      "Add a tablespoon of protein powder to the mix for an extra 20g protein.",
    ],
  },
  {
    id: "overnight-oats-banana-pb",
    title: "Banana Peanut Butter Overnight Oats",
    subtitle: "Thick, creamy, tastes like dessert",
    servings: 1,
    prepTime: "5 min",
    cookTime: "0 min (overnight soak)",
    calories: 450,
    protein: 22,
    tags: ["meal-prep", "no-cook", "high-protein"],
    ingredients: [
      { item: "Rolled oats", amount: "½ cup" },
      { item: "Peanut butter (or any nut butter)", amount: "2 tbsp" },
      { item: "Banana (ripe)", amount: "1 medium" },
      { item: "Milk (any)", amount: "½ cup" },
      { item: "Greek yoghurt", amount: "¼ cup" },
      { item: "Chia seeds", amount: "1 tbsp" },
      { item: "Honey or maple syrup", amount: "1 tsp" },
      { item: "Cinnamon", amount: "¼ tsp" },
      { item: "Pinch of salt", amount: "" },
    ],
    steps: [
      { text: "Mash half the banana in the bottom of a jar with a fork until smooth-ish." },
      { text: "Add oats, peanut butter, milk, yoghurt, chia seeds, honey, cinnamon, and salt. Stir thoroughly until peanut butter is incorporated." },
      { text: "Cover and refrigerate overnight (minimum 4 hours)." },
      { text: "In the morning, stir. Slice remaining half banana on top. Drizzle extra peanut butter if desired." },
    ],
    notes: [
      "Use an overripe banana for natural sweetness — you can skip the honey entirely.",
      "Crunchy peanut butter adds texture. Smooth makes it silkier.",
      "Top with a sprinkle of granola or dark chocolate chips for crunch.",
    ],
  },
];
