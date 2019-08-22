const { blankTokenMap } = require("./util.js");
const Exceptions = require("./exceptions.js");
const Card = require("./card");
const Combo = require("./combo");
const { Tokens } = require("./token.js");

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.boughtCards = [];
    this.reservedCards = [];
    this.boughtCombos = [];
    this.tokens = new Tokens();
    this.points = 0;
    this.isHost = false;
  }

  addTokens(tokens) {
    this.tokens = this.tokens.add(tokens);
  }

  removeTokens(tokens) {
    this.tokens = this.tokens.remove(tokens);
  }

  hasTokens(tokens) {
    return this.tokens.has(tokens);
  }

  canAfford(card) {
    return this.hasTokens(card.cost);
  }

  addCard(card) {
    this.boughtCards.push(card);
  }

  reserveCard(card) {
    this.reservedCards.push(card);
    this.tokens = this.tokens.add(new Tokens([0, 0, 0, 0, 0, 1]));
  }

  static parse(obj) {
    const player = new Player(obj.id, obj.name);
    player.boughtCards = obj.boughtCards.map(Card.parse);
    player.reservedCards = obj.reservedCards.map(Card.parse);
    player.boughtCombos = obj.boughtCombos.map(Combo.parse);
    player.tokens = Tokens.parse(obj.tokens);
    player.points = obj.points;
    player.isHost = obj.isHost;
    return player;
  }
}

module.exports = Player;
