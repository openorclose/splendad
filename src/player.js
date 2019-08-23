const { blankTokenMap } = require("./util.js");
const Exceptions = require("./exceptions.js");
const Card = require("./card");
const Combo = require("./combo");
const { Tokens, Token } = require("./token.js");

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

  getBonusTokens() {
    function caps(s) {
      return s[0].toUpperCase() + s.slice(1);
    }
    let bonusTokens = new Tokens();
    this.boughtCards.forEach(c => {
      bonusTokens = bonusTokens.add(Token[caps(c.color)]);
    });
    return bonusTokens;
  }

  getEffectiveTokens() {
    return this.tokens.add(this.getBonusTokens());
  }

  canAfford(card) {
    return this.getEffectiveTokens().has(card.cost);
  }

  buyCard(card) {
    const bonus = this.getBonusTokens();
    const discountedCost = new Tokens(
      card.cost.array.map((cost, index) =>
        Math.max(0, cost - bonus.array[index])
      )
    );
    this.tokens = this.tokens.remove(discountedCost);
    this.addCard(card);
    return discountedCost;
  }

  addCard(card) {
    this.boughtCards.push(card);
  }

  reserveCard(card) {
    this.reservedCards.push(card);
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
