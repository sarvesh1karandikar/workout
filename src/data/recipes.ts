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
];
