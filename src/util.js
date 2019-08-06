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

function randomCard() {
  const tier = rand(1, config.tier.length);
  return randomCardOfTier(tier);
}

function randomCardOfTier(tier) {
  ({ points, cost, maxCost } = config.tier[tier - 1]);
  const finalCost = blankTokenMap();
  const colorTypes = rand(1, 4);
  for (let i = 0; i < colorTypes; i++) {}

  return new Card(
    tier,
    randomColor(),
    rand(cost[0], cost[1]),
    rand(points[0], points[1])
  );
}

function blankTokenMap() {
  const map = new Map();
  // TODO
  for (let i in colors) {
    map.set(colors[i], 0);
  }
  return map;
}

function randomColor() {
  return colors[rand(0, colors.length - 1)];
}

function randomColors(n) {
  const tempColors = [...colors];
  for (let i = tempColors.length; i > n; i--) {
    tempColors.splice(rand(0, tempColors.length - 1), 1);
  }
  console.log(tempColors);
  console.log(colors);
  return tempColors;
}

function rand(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

module.exports = {
  generateDeck,
  populateMarket,
  populateTokens,
  populateCombos,
  blankTokenMap
};
