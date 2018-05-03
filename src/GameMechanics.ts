export const liberatorNames = [
  "112 TA",
  "UC Stone Stuco",
  "UC Stoner",
  "CMU Qatar",
  "Stonybrook",
  "My Little Stony",
  "12-201",
  "David Tepper",
  "Subra Suresh",
  "Super Suresh",
  "Super Dupra Suresh"
];

export const toolNames = [
  "Plastic knife",
  "Butter knife",
  "Safety Scissors",
  "Lawn mower",
  "Magnets",
  "Scythe",
  "Nice big axe",
  "Wire cutters",
  "Lightsaber",
  "Telekinesis",
  "Subronium"
];

function factorial(n: number) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function indexForItem(itemName: string, items: string[]) {
  const index = items.indexOf(itemName);

  if (index === -1) {
    throw new Error(`No such item: "${itemName}"`);
  }
  return index;
}

export function liberatorCost(level: number) {
  return 9.7654321 ** (level + 1);
}

export function liberatorRate(level: number) {
  return 2.1435 * factorial(level + 1);
}

export function toolCost(level: number) {
  return 9.7654321 ** (level + 1);
}

export function toolRate(level: number) {
  return level === 0 ? 1 : 2.856 * factorial(level + 1);
}
