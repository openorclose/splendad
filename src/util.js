const Card = require("./card.js");
const { Color } = require("./color.js");
const Combo = require("./combo.js");
const { Tokens } = require("./token");

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

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  const arr = [0, 0, 0, 0, 0, 0];
  const colorTypes = randomColors(rand(1, 4)).map(i => colors.indexOf(i));
  colorTypes.forEach(i => {
    arr[i] = 1;
  });

  // console.log(finalCost);
  let totalCost = rand(cost[0], cost[1]);
  totalCost -= colorTypes.length;
  while (totalCost > 0) {
    const i = colorTypes[rand(0, colorTypes.length - 1)];
    const currValue = arr[i];
    if (currValue < maxCost) {
      arr[i] = arr[i] + 1;
      totalCost -= 1;
    }

    if (colorTypes.length === 1 && currValue === maxCost) break;
  }
  return new Card(
    tier,
    randomColor(),
    new Tokens(arr),
    rand(points[0], points[1])
  );
}

function randomCard() {
  const tier = rand(1, config.tier.length);
  return randomCardOfTier(tier);
}

function generateDeck() {
  const deck = [];
  for (let i = 0; i < 3; i++) {
    deck.push([]);
    for (let j = 0; j < 20; j++) {
      deck[i].push(randomCardOfTier(i + 1));
    }
  }
  return deck;
}
function populateMarket(deck) {
  const market = [];
  for (let i = 0; i < 3; i++) {
    market.push([]);
    for (let j = 0; j < 4; j++) {
      market[i].push(deck[i].pop());
    }
  }
  return market;
}
function populateTokens() {
  // tokens.forEach((i, j) => tokens.set(j, numPlayers + 1));
  return new Tokens(new Array(6).fill(5));
}
function populateCombos() {
  const combos = [];
  for (let i = 0; i < 4; i++) {
    // TODO fill in tokens
    combos.push(new Combo(new Tokens(), 3));
  }
  return combos;
}

function parseTokens(arr) {
  // const tokenMap = blankTokenMap();
  // arr.forEach((i, j) => {
  //   const color = colors[j];
  //   tokenMap.set(color, i);
  // });
  return new Tokens(arr);
}

function isEqual(a, b) {
  function isObject(obj) {
    return typeof obj === "object";
  }

  function isArray(obj) {
    return Array.isArray(obj);
  }

  if (typeof a !== typeof b) return false;

  if (isObject(a) && isObject(b)) {
    for (let i in a) {
      if (a.hasOwnProperty(i)) {
        if (!isEqual(a[i], b[i])) {
          return false;
        }
      }
    }
    return true;
  } else if (isArray(a) && isArray(b)) {
    return (
      a.length === b.length && a.every((item, index) => isEqual(item, b[index]))
    );
  } else {
    return a === b;
  }
}

module.exports = {
  generateDeck,
  populateMarket,
  populateTokens,
  populateCombos,
  parseTokens,
  isEqual
};
