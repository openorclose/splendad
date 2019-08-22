const chalk = require("chalk");
const inquirer = require("inquirer");
const Game = require("./game");
const Player = require("./player");
const Action = require("./action");
const { Tokens } = require("./token");

const tokenFormatters = [
  chalk.red,
  chalk.green,
  chalk.blue,
  chalk.white,
  chalk.gray,
  chalk.yellow
];

const formattedTokens = "Red Green Blue White Black"
  .split(" ")
  .map((i, index) => tokenFormatters[index](i));

function main() {
  const game = new Game();
  game.addPlayer(new Player(0, "player1"));
  game.addPlayer(new Player(1, "player2"));
  game.init();
  turn(game);
}

class Renderer {
  static renderTokens(tokens) {
    return `[${tokenFormatters
      .map((i, index) => {
        return i(tokens.array[index]);
      })
      .join(" ")}]`;
  }

  static buyChoices(game, player) {
    return game.market
      .reduce((acc, i) => acc.concat(i.map(Renderer.renderCard)), [])
      .concat(player.reservedCards.map(Renderer.renderCard));
  }

  static reserveChoices(game, player) {
    return game.market.reduce(
      (acc, i) => acc.concat(i.map(Renderer.renderCard)),
      []
    );
  }

  static renderCard(card) {
    function stars() {
      let out = "";
      for (let i = 0; i < card.tier; i++) out += "*";
      return out;
    }
    return `[${card.id}] (${card.points}) ${
      card.color
    }${stars()} ${Renderer.renderTokens(card.cost)}`;
  }
}

function parseAction(ans, game, player) {
  // Draw tokens", "Buy card", "Reserve card", "Pass
  if (ans.action === "Draw tokens") {
    const tokensArray = [0, 0, 0, 0, 0, 0];
    const letters = "RGBWK";
    ans.tokens
      .toUpperCase()
      .split("")
      .forEach(i => {
        const index = letters.indexOf(i);
        index !== -1 ? (tokensArray[index] += 1) : 0;
      });

    return new Action.TokenAction(
      new Tokens(tokensArray),
      new Tokens(),
      game.id,
      player.id
    );
  }

  const cardIdRegex = /^\[(\d+)\]/;
  const cardId = cardIdRegex.exec(ans.cardId)[1];
  if (ans.action === "Buy card") {
    return new Action.BuyAction(cardId, game.id, player.id);
  }

  if (ans.action === "Reserve card") {
    return new Action.ReserveAction(cardId, game.id, player.id);
  }

  return new Action.PassAction(game.id, player.id);
}

function turn(game) {
  if (game.isEnded()) {
    return;
  }

  const questions = [
    {
      type: "list",
      name: "action",
      message: "Action",
      choices: ["Draw tokens", "Buy card", "Reserve card", "Pass"]
    },
    {
      type: "input",
      name: "tokens",
      message: `Tokens (type up to 3 letters) ${"RGBWK"
        .split("")
        .map((i, index) => tokenFormatters[index](i))
        .join("")}`,
      choices: formattedTokens,
      when: answers => answers.action === "Draw tokens",
      transformer: input => {
        const letters = "RGBWK";
        return letters
          .split("")
          .reduce(
            (acc, item, index) =>
              acc.split(item).join(tokenFormatters[index](item)),
            input.toUpperCase()
          );
      }
    },
    {
      type: "list",
      name: "cardId",
      message: "Select a card to buy",
      choices: Renderer.buyChoices(game, game.currentPlayer),
      when: answers => answers.action === "Buy card"
    },
    {
      type: "list",
      name: "cardId",
      message: "Select a card to reserve",
      choices: Renderer.reserveChoices(game),
      when: answers => answers.action === "Reserve card"
    }
  ];

  console.log();
  console.log(
    chalk.yellow(`${game.currentPlayer.name}'s turn`),
    Renderer.renderTokens(game.currentPlayer.tokens)
  );
  console.log("Available tokens:", Renderer.renderTokens(game.tokens));
  return inquirer.prompt(questions).then(ans => {
    const action = parseAction(ans, game, game.currentPlayer);
    const message = game.applyAction(action);
    console.log(
      message.error ? chalk.red(message.error) : chalk.green(message.message)
    );
    turn(game);
  });
}

main();
