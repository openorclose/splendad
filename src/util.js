const Card = require("./card.js");
const Color = require("./color.js");
const Combo = require("./combo.js");

const colors = [Color.Red, Color.Green, Color.Blue, Color.White, Color.Black];

const config = {
  deckSize: 30,
  tier: [
    {
      points: [0, 1],
      cost: [3, 5],
      maxCost: 3
    },
    {
      points: [1, 3],
      cost: [5, 9],
      maxCost: 5
    },
    {
      points: [3, 5],
      cost: [9, 12],
      maxCost: 7
    }
  ]
};

function blankTokenMap() {
  const map = new Map();
  // TODO
  for (const i in colors) {
    map.set(colors[i], 0);
  }
  return map;
}

function rand(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function randomColor() {
  return colors[rand(0, colors.length - 1)];
}

function randomColors(n) {
  const tempColors = [...colors];
  for (let i = tempColors.length; i > n; i--) {
    tempColors.splice(rand(0, tempColors.length - 1), 1);
  }
  return tempColors;
}

function randomCardOfTier(tier) {
  const { points, cost, maxCost } = config.tier[tier - 1];
  const finalCost = blankTokenMap();
  const colorTypes = randomColors(rand(1, 4));
  colorTypes.forEach(color => {
    const item = finalCost.get(color);
    finalCost.set(color, item + 1);
  });

  // console.log(finalCost);
  let totalCost = rand(cost[0], cost[1]);
  totalCost -= colorTypes.length;
  while (totalCost > 0) {
    const color = colorTypes[rand(0, colorTypes.length - 1)];
    const currValue = finalCost.get(color);
    if (currValue < maxCost) {
      finalCost.set(color, currValue + 1);
      totalCost -= 1;
    }

    if (colorTypes.length === 1 && currValue === maxCost) break;
  }
  return new Card(tier, randomColor(), finalCost, rand(points[0], points[1]));
}

function randomCard() {
  const tier = rand(1, config.tier.length);
  return randomCardOfTier(tier);
}

function generateDeck() {
  const deck = new Map();
  for (let i = 1; i <= 3; i++) {
    deck.set(i, []);
    for (let j = 0; j < 20; j++) {
      deck.get(i).push(randomCardOfTier(i));
    }
  }
  return deck;
}
function populateMarket(deck) {
  const market = new Map();
  for (let i = 1; i <= 3; i++) {
    market.set(i, []);
    for (let j = 0; j < 4; j++) {
      market.get(i).push(deck.get(i).pop());
    }
  }
  return market;
}
function populateTokens(numPlayers) {
  const tokens = blankTokenMap();
  tokens.forEach((i, j) => tokens.set(j, numPlayers + 1));
  return tokens;
}
function populateCombos() {
  const combos = [];
  for (let i = 0; i < 4; i++) {
    combos.push(new Combo(blankTokenMap(), 3));
  }
  return combos;
}

module.exports = {
  generateDeck,
  populateMarket,
  populateTokens,
  populateCombos,
  blankTokenMap
};
