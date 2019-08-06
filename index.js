const Game = require("./src/game.js");
const Player = require("./src/player.js");

const game = new Game();

const players = [
  new Player(1, "a"),
  new Player(2, "b"),
  new Player(3, "c"),
  new Player(4, "d")
];

players.forEach(player => game.addPlayer(player));

game.init();
console.log("Market:");
console.log(
  Array.from(game.market.values())
    .map(i => i.toString())
    .join("\n")
);
