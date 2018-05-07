interface Unlockable {
  name: string;
  description: string;
  image: string;
  level: number;
}

export interface Tool extends Unlockable {
  cursor: string;
  rate: number;
  totalStonesNeeded: number;
}

export interface Protester extends Unlockable {
  baseCost: number;
  rate: number;
}

export interface PublicFigure extends Unlockable {
  percent: number;
  totalStonesNeeded: number;
  cost: number;
  clickUpgrade: boolean;
  minLevel: number;
}

export interface Campus extends Unlockable {
  totalStonesNeeded: number;
  cost: number;
  minLevel: number;
}

export const publicFigures: PublicFigure[] = [
  {
    name: "UC Stoners",
    clickUpgrade: true,
    percent: 1.5,
    image: require("./images/public-figures/uc-stoner.png"),
    minLevel: 2
  },
  {
    name: "UC Kidney Stones",
    clickUpgrade: true,
    percent: 2,
    image: require("./images/public-figures/uc-kidney-stone.png"),
    minLevel: 3
  },
  {
    name: "UC Rolling Stones",
    clickUpgrade: false,
    percent: 0.9,
    image: require("./images/public-figures/uc-rolling-stones.png"),
    minLevel: 4
  },
  {
    name: "Indiana UC Stones",
    clickUpgrade: true,
    percent: 2,
    image: require("./images/public-figures/indiana-jones.png"),
    minLevel: 5
  },
  {
    name: "The Artist Formerly Known as The UC Stones",
    clickUpgrade: false,
    percent: 0.9,
    image: require("./images/public-figures/prince.png"),
    minLevel: 6
  },
  {
    name: "UC Stone Cold Steve Austin",
    clickUpgrade: true,
    percent: 3,
    image: require("./images/public-figures/steve-austin.png"),
    minLevel: 8
  },
  {
    name: "Dwayne “The UC Stones” Johnson",
    clickUpgrade: false,
    percent: 0.1,
    image: require("./images/public-figures/the-rock.png"),
    minLevel: 9
  }
].map((p, level) => ({
  ...p,
  level,
  cost: 7 ** (level + 5),
  totalStonesNeeded: 14 ** (level + 3),
  description: p.clickUpgrade
    ? `Your clicks free ${p.percent}X more stones`
    : `Protesters cost ${Math.round((1 - p.percent) * 100)}% less`
}));

export const protesters: Protester[] = [
  {
    name: "112 TA",
    description: "Blue-hooded stone freers",
    image: require("./images/protesters/112.png")
  },
  {
    name: '"First Year"',
    description: "foo",
    image: require("./images/protesters/first-year.png")
  },
  {
    name: "Super Senior",
    description: "foo",
    image: require("./images/protesters/super-senior.png")
  },
  {
    name: "AEPi Brother",
    description: "foo",
    image: require("./images/protesters/AEPi-brother.png")
  },
  {
    name: "One Spicy Teen",
    description: "foo",
    image: require("./images/protesters/spicy-teen.png")
  },
  {
    name: "Free Mason",
    description: "foo",
    image: require("./images/protesters/free-mason.png")
  },
  {
    name: "An Already Free Stone",
    description: "foo",
    image: require("./images/protesters/free-stone.png")
  },
  {
    name: "Geology Major",
    description: "foo",
    image: require("./images/protesters/geology-major.png")
  }
].map((p, level) => ({
  ...p,
  level,
  baseCost: baseProtesterCost(level),
  rate: protesterRate(level)
}));

const toolsRaw = [
  {
    name: "Cursor",
    description: "",
    image: require("./images/tools/cursor.png"),
    cursor: require("./images/tools/cursor-cursor.png")
  },
  {
    name: "Plastic knife",
    description: "Not very effective",
    image: require("./images/tools/plastic-knife.png"),
    cursor: require("./images/tools/plastic-knife-cursor.png")
  },
  {
    name: "Nail file",
    description: "At least it's metal",
    image: require("./images/tools/nail-file.png"),
    cursor: require("./images/tools/nail-file-cursor.png")
  },
  {
    name: "Scissors",
    description: "Useful on the cut",
    image: require("./images/tools/scissors.png"),
    cursor: require("./images/tools/scissors-cursor.png")
  },
  {
    name: "Magnets?",
    description: "???",
    image: require("./images/tools/magnet.png"),
    cursor: require("./images/tools/magnet-cursor.png")
  },
  {
    name: "Pickaxe",
    description: "(Not Enchanted)",
    image: require("./images/tools/diamond-pickaxe.png"),
    cursor: require("./images/tools/diamond-pickaxe-cursor.png")
  },
  {
    name: "Wire Cutters",
    description: "Thanks ECEs!",
    image: require("./images/tools/wire-cutters.png"),
    cursor: require("./images/tools/wire-cutters-cursor.png")
  },
  {
    name: "Lightsaber",
    description: "Use the force",
    image: require("./images/tools/lightsaber.png"),
    cursor: require("./images/tools/lightsaber-cursor.png")
  },
  {
    name: "Telekinesis",
    description: "The other CS major",
    image: require("./images/tools/brain.png"),
    cursor: require("./images/tools/brain-cursor.png")
  },
  {
    name: "Subronium",
    description: "HOLY $#!+",
    image: require("./images/tools/subronium.png"),
    cursor: require("./images/tools/subronium-cursor.png")
  },
  {
    name: "Jahanianite",
    description: "/ (╯°□°）╯︵ ┻━┻",
    image: require("./images/tools/jahanianite.png"),
    cursor: require("./images/tools/jahanianite-cursor.png")
  }
];

const enchantedPickaxe = {
  name: "Pickaxe",
  description: "(Enchanted)",
  image: require("./images/tools/diamond-pickaxe-enchanted.png"),
  cursor: require("./images/tools/diamond-pickaxe-enchanted-cursor.png")
};

if (Math.random() > 0.5) {
  toolsRaw.splice(5, 1, enchantedPickaxe);
}

export const tools: Tool[] = toolsRaw.map((p, level) => ({
  ...p,
  level,
  totalStonesNeeded: stonedNeededForTool(level),
  rate: toolRate(level)
}));

export const campuses: Campus[] = [
  {
    name: "CMU Silicon Valley",
    description: "Protesters free stones at 2X normal speed",
    image: require("./images/campuses/ca.png"),
    minLevel: 5
  },
  {
    name: "CMU Qatar",
    description: "Each protester increases stones freed per click",
    image: require("./images/campuses/qatar.png"),
    minLevel: 6
  },
  {
    name: "Central Michigan University",
    description: "Protesters free stones at 5X normal speed",
    image: require("./images/campuses/cmu.png"),
    minLevel: 7
  },
  {
    name: "Nanyang Technological University Singapore",
    description: "Your clicks free 8X stones per click",
    image: require("./images/campuses/nanyang.png"),
    minLevel: 9
  }
].map((p, level) => ({
  ...p,
  level,
  cost: level === 3 ? 9 ** (level + 8) : 6.5 ** (level + 8),
  totalStonesNeeded: 7 ** (level + 6)
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

export function baseProtesterCost(level: number) {
  return 9 ** (level + 1);
}

// http://cookieclicker.wikia.com/wiki/Building
export function nextProtesterCost(protester: Protester, count: number) {
  return protester.baseCost * 1.12 ** count;
}

function protesterRate(level: number) {
  return (level + 2) / 2 * factorial(level + 1);
}

function stonedNeededForTool(level: number) {
  if (level > toolsRaw.length - 3) {
    return 15 ** (level + 1);
  }
  return 12 ** (level + 1);
}

function toolRate(level: number) {
  return level < 3 ? (level + 1) ** 2 : 2 * factorial(level + 1);
}
