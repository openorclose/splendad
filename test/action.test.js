const Actions = require("../src/action.js");
const { Tokens, Token } = require("../src/token");
const { GameStub, CardStub, PlayerStub } = require("./stub");
const Game = require("../src/game");

test("draw tokens", () => {
  let game = new GameStub();
  game.init();
  let player = game.players[0];
  game.applyAction(
    new Actions.TokenAction(
      new Tokens([1, 1, 1, 0, 0, 0]),
      new Tokens(),
      game.id,
      player.id
    )
  );
  expect(game.tokens).toStrictEqual(new Tokens([4, 4, 4, 5, 5, 5]));
  expect(player.tokens).toStrictEqual(new Tokens([1, 1, 1, 0, 0, 0]));
});

test("draw 2 tokens", () => {
  let game = new GameStub();
  game.init();
  let player = game.currentPlayer;
  console.log(
    game.applyAction(
      new Actions.TokenAction(
        new Tokens([2, 0, 0, 0, 0, 0]),
        new Tokens(),
        game.id,
        player.id
      )
    )
  );
  expect(game.tokens).toStrictEqual(new Tokens([3, 5, 5, 5, 5, 5]));
  expect(player.tokens).toStrictEqual(new Tokens([2, 0, 0, 0, 0, 0]));

  player = game.currentPlayer;
  console.log(
    game.applyAction(
      new Actions.TokenAction(
        new Tokens([2, 0, 0, 0, 0, 0]),
        new Tokens(),
        game.id,
        player.id
      )
    )
  );
  expect(game.tokens).toStrictEqual(new Tokens([3, 5, 5, 5, 5, 5]));
  expect(player.tokens).toStrictEqual(new Tokens([0, 0, 0, 0, 0, 0]));
});

test("draw tokens when empty", () => {
  let game = new GameStub();
  game.init();
  game.tokens = new Tokens();
  let player = game.players[0];
  game.applyAction(
    new Actions.TokenAction(
      new Tokens([1, 1, 1, 0, 0, 0]),
      new Tokens(),
      game.id,
      player.id
    )
  );
  expect(game.tokens).toStrictEqual(new Tokens());
  expect(player.tokens).toStrictEqual(new Tokens());
});

test("buy card", () => {
  let game = new Game(1);
  PlayerStub.getPlayers().forEach(player => game.addPlayer(player));
  game.init();
  let player = game.players[0];
  let card = game.market[0][0];
  player.addTokens(card.cost);
  expect(player.tokens).toStrictEqual(card.cost);
  console.log(
    game.applyAction(new Actions.BuyAction(card.id, game.id, player.id))
  );
  expect(player.boughtCards).toStrictEqual([card]);
  expect(player.tokens).toStrictEqual(new Tokens());
  expect(game.hasCardInMarket(card)).toBe(false);
});

test("buy card with wildcard", () => {
  let game = new Game(1);
  PlayerStub.getPlayers().forEach(player => game.addPlayer(player));
  game.init();
  let player = game.players[0];
  let card = game.market[0][0];
  player.addTokens(new Tokens([0, 0, 0, 0, 0, card.cost.total()]));
  // expect(player.tokens).toStrictEqual(card.cost);
  console.log(
    game.applyAction(new Actions.BuyAction(card.id, game.id, player.id))
  );
  expect(player.boughtCards).toStrictEqual([card]);
  expect(player.tokens).toStrictEqual(new Tokens());
  expect(game.hasCardInMarket(card)).toBe(false);
});

test("reserve and buy card", () => {
  let game = new Game(1);
  PlayerStub.getPlayers()
    .slice(0, 2)
    .forEach(player => game.addPlayer(player));
  game.init();
  let player = game.players[0];
  let card = game.market[0][0];
  // expect(player.tokens).toStrictEqual(card.cost);
  console.log(
    game.applyAction(new Actions.ReserveAction(card.id, game.id, player.id))
  );
  expect(player.reservedCards).toStrictEqual([card]);
  expect(player.tokens).toStrictEqual(Token.Wild);
  expect(game.hasCardInMarket(card)).toBe(false);

  player = game.currentPlayer;
  game.applyAction(new Actions.PassAction(game.id, player.id));

  player = game.currentPlayer;
  player.addTokens(card.cost);
  console.log(
    game.applyAction(new Actions.BuyAction(card.id, game.id, player.id))
  );
  expect(player.reservedCards).toStrictEqual([]);
  expect(player.boughtCards).toStrictEqual([card]);
  expect(player.tokens).toStrictEqual(Token.Wild);
});
