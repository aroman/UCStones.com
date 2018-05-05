type Tool = {
  name: string;
  description: string;
  image: string;
  cursor: string;
  upgradePoints: number;
};

type Protester = {
  name: string;
  description: string;
  image: string;
  cost: number;
};

type PublicFigure = {
  name: string;
  description: string;
  image: string;
  cost: number;
};

type Campus = {
  name: string;
  description: string;
  image: string;
  cost: number;
};

export const publicFigures: PublicFigure[] = [
  {
    name: "UC Stoners",
    description: "adnajsdjkansdadsas",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "UC Kidney Stones",
    description: "adnajsdjkansd",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "UC Rolling Stones",
    description: "adnajsdjkansd",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "Indiana UC Stones",
    description: "adnajsdjkansd",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "The Artist Formerly Known as The UC Stones",
    description: "Foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "UC Stone Cold Steve Austin",
    description: "Foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "Dwayne “The UC Stones” Johnson",
    description: "Foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  }
];

export const protesters: Protester[] = [
  {
    name: "112 TAs",
    description: "Blue-hooded stone freers",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: '"First Years"',
    description: "foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "Super Seniors",
    description: "foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "AEPi Brothers",
    description: "foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "The Spicy Teens",
    description: "foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "Free Masons",
    description: "foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "Already Free Stones",
    description: "foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  },
  {
    name: "Geology Majors",
    description: "foo",
    image: require("./images/protesters/112.png"),
    cost: 10
  }
];

export const tools: Tool[] = [
  {
    name: "Plastic knife",
    description: "Not very effective",
    image: require("./images/tools/plastic-knife.png"),
    cursor: require("./images/tools/plastic-knife-cursor.png"),
    upgradePoints: 15
  },
  {
    name: "Nail file",
    description: "Not very effective",
    image: require("./images/tools/nail-file.png"),
    cursor: require("./images/tools/nail-file-cursor.png"),
    upgradePoints: 100
  },
  {
    name: "Scissors",
    description: "Not very effective",
    image: require("./images/tools/scissors.png"),
    cursor: require("./images/tools/scissors-cursor.png"),
    upgradePoints: 100
  },
  {
    name: "Magnets?",
    description: "Not very effective",
    image: require("./images/tools/magnet.png"),
    cursor: require("./images/tools/magnet-cursor.png"),
    upgradePoints: 100
  },
  {
    name: "Wire Cutters",
    description: "Not very effective",
    image: require("./images/tools/wire-cutters.png"),
    cursor: require("./images/tools/wire-cutters-cursor.png"),
    upgradePoints: 100
  },
  {
    name: "Lightsaber",
    description: "Not very effective",
    image: require("./images/tools/lightsaber.png"),
    cursor: require("./images/tools/lightsaber-cursor.png"),
    upgradePoints: 100
  },
  {
    name: "Telekinesis",
    description: "Not very effective",
    image: require("./images/tools/brain.png"),
    cursor: require("./images/tools/brain-cursor.png"),
    upgradePoints: 100
  },
  {
    name: "Subronium",
    description: "Not very effective",
    image: require("./images/tools/subronium.png"),
    cursor: require("./images/tools/subronium-cursor.png"),
    upgradePoints: 100
  }
];

export const campuses: Campus[] = [
  {
    name: "Carnegie Mellon University",
    description: "abc",
    image: require("./images/tools/subronium.png"),
    cost: 10
  },
  {
    name: "CMU Qatar",
    description: "abc",
    image: require("./images/tools/subronium.png"),
    cost: 10
  },
  {
    name: "CMU Rwanda",
    description: "abc",
    image: require("./images/tools/subronium.png"),
    cost: 10
  },
  {
    name: "CMU Silicon Valley",
    description: "abc",
    image: require("./images/tools/subronium.png"),
    cost: 10
  },
  {
    name: "Central Michigan University",
    description: "abc",
    image: require("./images/tools/subronium.png"),
    cost: 10
  },
  {
    name: "Nanyang Technological University Singapore",
    description: "abc",
    image: require("./images/tools/subronium.png"),
    cost: 10
  }
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
