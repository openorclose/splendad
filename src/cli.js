const chalk = require("chalk");
const inquirer = require("inquirer");
const Game = require("./game");
const Player = require("./player");
const Action = require("./action");
const { Tokens } = require("./token");

const formattedTokens = [
  chalk.red("Red"),
  chalk.green("Green"),
  chalk.blue("Blue"),
  chalk.white("White"),
  chalk.black("Black")
];

const tokenFormatters = [
  chalk.red,
  chalk.green,
  chalk.blue,
  chalk.white,
  chalk.black
];

function main() {
  const game = new Game();
  game.addPlayer(new Player(0, "player1"));
  game.addPlayer(new Player(1, "player2"));
  game.init();
  turn(game);
}

class Renderer {
  static renderTokens(tokens) {
    return [chalk.red, chalk.green, chalk.blue, chalk.white, chalk.black]
      .map((i, index) => {
        return i(tokens.array[index]);
      })
      .join(" ");
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
    const tokensArray = [0, 0, 0, 0, 0];
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

  if (ans.action === "Buy card") {
    return new Action.BuyAction(ans.cardId, game.id, player.id);
  }

  if (ans.action === "Reserve card") {
    return new Action.ReserveAction(ans.cardId, game.id, player.id);
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
      message: `Tokens (type up to 3 letters): ${tokenFormatters
        .map((i, index) => i("RGBWK"[index]))
        .join("")}`,
      choices: formattedTokens,
      when: answers => answers.action === "Draw tokens"
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

  console.log(chalk.yellow(`Player ${game.currentPlayer.name}'s turn`));
  console.log("Tokens: ");
  console.log(Renderer.renderTokens(game.currentPlayer.tokens));
  return inquirer.prompt(questions).then(ans => {
    const action = parseAction(ans, game, game.currentPlayer);
    const message = game.applyAction(action);
    console.log(message);
    turn(game);
  });
}

main();
