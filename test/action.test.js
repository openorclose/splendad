const Actions = require("../src/action.js");
const { Tokens } = require("../src/token");
const { GameStub } = require("./stub");
test("draw tokens", () => {
  let game = new GameStub();
  game.init();
  let player = game.players[0];
  game.applyAction(
    new Actions.TokenAction(
      new Tokens([1, 1, 1, 0, 0]),
      new Tokens(),
      game.id,
      player
    )
  );
  expect(game.tokens).toStrictEqual(new Tokens([4, 4, 4, 5, 5]));
  expect(player.tokens).toStrictEqual(new Tokens([1, 1, 1, 0, 0]));
});

test("draw tokens when empty", () => {
  let game = new GameStub();
  game.init();
  game.tokens = new Tokens();
  let player = game.players[0];
  game.applyAction(
    new Actions.TokenAction(
      new Tokens([1, 1, 1, 0, 0]),
      new Tokens(),
      game.id,
      player
    )
  );
  expect(game.tokens).toStrictEqual(new Tokens());
  expect(player.tokens).toStrictEqual(new Tokens());
});
