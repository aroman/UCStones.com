interface Unlockable {
  name: string;
  description: string;
  image: string;
  cost: number;
  level: number;
}

interface Tool extends Unlockable {
  cursor: string;
  rate: number;
}

export interface Protester extends Unlockable {
  rate: number;
}

interface PublicFigure extends Unlockable {
  percent: number;
}

interface Campus extends Unlockable {
  multiplier: number;
}

export const publicFigures: PublicFigure[] = [
  {
    name: "UC Stoners",
    description: "adnajsdjkansdadsas",
    image: require("./images/protesters/112.png")
  },
  {
    name: "UC Kidney Stones",
    description: "adnajsdjkansd",
    image: require("./images/protesters/112.png")
  },
  {
    name: "UC Rolling Stones",
    description: "adnajsdjkansd",
    image: require("./images/protesters/112.png")
  },
  {
    name: "Indiana UC Stones",
    description: "adnajsdjkansd",
    image: require("./images/protesters/112.png")
  },
  {
    name: "The Artist Formerly Known as The UC Stones",
    description: "Foo",
    image: require("./images/protesters/112.png")
  },
  {
    name: "UC Stone Cold Steve Austin",
    description: "Foo",
    image: require("./images/protesters/112.png")
  },
  {
    name: "Dwayne “The UC Stones” Johnson",
    description: "Foo",
    image: require("./images/protesters/112.png")
  }
].map((p, level) => ({
  ...p,
  level,
  cost: 100 * level,
  percent: 2 * level
}));

export const protesters: Protester[] = [
  {
    name: "112 TAs",
    description: "Blue-hooded stone freers",
    image: require("./images/protesters/112.png")
  },
  {
    name: '"First Years"',
    description: "foo",
    image: require("./images/protesters/112.png")
  },
  {
    name: "Super Seniors",
    description: "foo",
    image: require("./images/protesters/112.png")
  },
  {
    name: "AEPi Brothers",
    description: "foo",
    image: require("./images/protesters/112.png")
  },
  {
    name: "The Spicy Teens",
    description: "foo",
    image: require("./images/protesters/112.png")
  },
  {
    name: "Free Masons",
    description: "foo",
    image: require("./images/protesters/112.png")
  },
  {
    name: "Already Free Stones",
    description: "foo",
    image: require("./images/protesters/112.png")
  },
  {
    name: "Geology Majors",
    description: "foo",
    image: require("./images/protesters/112.png")
  }
].map((p, level) => ({
  ...p,
  level,
  cost: protesterCost(level),
  rate: protesterRate(level)
}));

export const tools: Tool[] = [
  {
    name: "Plastic knife",
    description: "Not very effective",
    image: require("./images/tools/plastic-knife.png"),
    cursor: require("./images/tools/plastic-knife-cursor.png")
  },
  {
    name: "Nail file",
    description: "Not very effective",
    image: require("./images/tools/nail-file.png"),
    cursor: require("./images/tools/nail-file-cursor.png")
  },
  {
    name: "Scissors",
    description: "Not very effective",
    image: require("./images/tools/scissors.png"),
    cursor: require("./images/tools/scissors-cursor.png")
  },
  {
    name: "Magnets?",
    description: "Not very effective",
    image: require("./images/tools/magnet.png"),
    cursor: require("./images/tools/magnet-cursor.png")
  },
  {
    name: "Wire Cutters",
    description: "Not very effective",
    image: require("./images/tools/wire-cutters.png"),
    cursor: require("./images/tools/wire-cutters-cursor.png")
  },
  {
    name: "Lightsaber",
    description: "Not very effective",
    image: require("./images/tools/lightsaber.png"),
    cursor: require("./images/tools/lightsaber-cursor.png")
  },
  {
    name: "Telekinesis",
    description: "Not very effective",
    image: require("./images/tools/brain.png"),
    cursor: require("./images/tools/brain-cursor.png")
  },
  {
    name: "Subronium",
    description: "Not very effective",
    image: require("./images/tools/subronium.png"),
    cursor: require("./images/tools/subronium-cursor.png")
  }
].map((p, level) => ({
  ...p,
  level,
  cost: toolCost(level),
  rate: toolRate(level)
}));

export const campuses: Campus[] = [
  {
    name: "Carnegie Mellon University",
    description: "abc",
    image: require("./images/tools/subronium.png")
  },
  {
    name: "CMU Qatar",
    description: "abc",
    image: require("./images/tools/subronium.png")
  },
  {
    name: "CMU Rwanda",
    description: "abc",
    image: require("./images/tools/subronium.png")
  },
  {
    name: "CMU Silicon Valley",
    description: "abc",
    image: require("./images/tools/subronium.png")
  },
  {
    name: "Central Michigan University",
    description: "abc",
    image: require("./images/tools/subronium.png")
  },
  {
    name: "Nanyang Technological University Singapore",
    description: "abc",
    image: require("./images/tools/subronium.png")
  }
].map((p, level) => ({
  ...p,
  level,
  multiplier: 1,
  cost: toolCost(level),
  rate: toolRate(level)
}));

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

function protesterCost(level: number) {
  return 10 ** (level + 1);
}

function protesterRate(level: number) {
  return 2 * factorial(level + 1);
}

function toolCost(level: number) {
  return 10 ** (level + 1);
}

function toolRate(level: number) {
  return level === 0 ? 1 : 2 * factorial(level + 1);
}
