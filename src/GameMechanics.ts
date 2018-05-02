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

export function liberatorCost(i: number) {
  return 8.7654321 ** (i + 1);
}

export function liberatorRate(i: number) {
  return 2.345 * factorial(i + 1);
}

export function toolCost(i: number) {
  return 8.7654321 ** (i + 1);
}

export function toolRate(i: number) {
  return i === 0 ? 1 : 3.456 * factorial(i + 1);
}
