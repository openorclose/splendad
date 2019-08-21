const Game = require("../src/game");
const { GameStub } = require("./stub");
const { Tokens } = require("../src/token");
test("game init", () => {
  let game = new GameStub();
  game.init();
  expect(game.tokens).toStrictEqual(new Tokens([5, 5, 5, 5, 5]));
});
