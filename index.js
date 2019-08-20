const Game = require("./src/game.js");
const Player = require("./src/player.js");

const {
  Action,
  BuyAction,
  PassAction,
  ReserveAction,
  TokenAction
} = require("./src/action.js");

const Util = require("./src/util.js");
const { Tokens } = require("./src/token");

const GAMEID = 0;
const game = new Game(GAMEID);

const players = [
  new Player(1, "a"),
  new Player(2, "b"),
  new Player(3, "c"),
  new Player(4, "d")
];

function randomAction() {}

function simulate() {
  const TIMEOUT = 1000;
  const player = players.find(p => p === game.currentPlayer);
  if (player)
    game.applyAction(
      new TokenAction(
        Util.parseTokens([1, 0, 1, 0, 1]),
        new Tokens(),
        GAMEID,
        player
      )
    );
  setTimeout(simulate, TIMEOUT);
}

function init() {
  // game.printMarket();

  players.forEach(player => game.addPlayer(player));
  game.init();
  const str = game.serialize();
  const parsed = Game.deserialize(str);
  console.log(Util.isEqual(game, parsed));
  // console.log(game.market[0][0]);
  // console.log(parsed);
  // console.log(parsed.market[0][0]);
  // console.log(game.cards);
  // console.log(game.getCardById(20));
  // simulate();
}

init();
