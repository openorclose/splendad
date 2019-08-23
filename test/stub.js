const Game = require("../src/game");
const Player = require("../src/player");
const Timer = require("../src/timer");
const { Tokens } = require("../src/token");
const Card = require("../src/card");

/**
 * Game stub containing no cards, 4 players, and 5 tokens of each color
 */
class GameStub extends Game {
  constructor() {
    super(0);
  }

  init() {
    this.deck = this.generateDeck();
    this.cards = Array.from(this.deck.values());
    this.market = this.populateMarket(this.deck);
    this.combos = this.populateCombos();
    this.tokens = this.populateTokens();
    PlayerStub.getPlayers().forEach(player => this.addPlayer(player));
    this.timer = new Timer(this.players);
    this._currentTurn = 0;
    this.currentPlayer = this.players[0];
  }

  generateDeck() {
    return [[], [], []];
  }

  populateMarket(deck) {
    return [[], [], []];
  }

  populateCombos() {
    return [];
  }

  populateTokens() {
    return new Tokens([5, 5, 5, 5, 5, 5]);
  }
}

class CardStub {
  static getTestCard(id = 1, tier = 1) {
    return new Card(tier, "red", new Tokens([3, 0, 0, 0, 0, 0]), 1, id);
  }
}

class PlayerStub extends Player {
  constructor() {
    super(0, "testPlayer");
  }

  static getPlayers() {
    return [
      new Player(0, "test0"),
      new Player(1, "test1"),
      new Player(2, "test2"),
      new Player(3, "test3")
    ];
  }
}

module.exports = { GameStub, PlayerStub, CardStub };
