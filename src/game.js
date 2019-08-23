const {
  generateDeck,
  populateCombos,
  populateTokens,
  populateMarket
} = require("./util.js");

const Timer = require("./timer.js");
const Player = require("./player");
const Card = require("./card");
const Combo = require("./combo");
const Util = require("./util");
const { Tokens } = require("./token.js");

let i = 0;
const State = {
  PreInit: i++,
  Start: i++,
  Round: i++,
  FinalRound: i++,
  End: i++
};

class Game {
  //     `
  // + id: Number
  // + players: Player[]
  // + timer: Timer
  // + deck: Map<Number, Card[]>
  // + market: Map<Number, Card[]>
  // + tokens: Map<Token, Number>
  // + combos: Combo[]
  // + state: State
  // + host: Player
  // + winners: Player[]
  // `

  constructor(id) {
    this.id = id;
    this.players = [];
    this.cards = [];
    this.deck = [];
    this.market = [];
    this.tokens = new Tokens();
    this.combos = [];
    this.history = [];
    this.state = State.PreInit;
    this.winners = [];
    this._currentTurn = 0;
    this.currentPlayer = undefined;

    console.log("Game constructor called");
  }

  addPlayer(player) {
    this.players.push(player);
  }

  init() {
    this.deck = generateDeck();
    this.cards = this.deck.map(i => Array.from(i));
    this.market = populateMarket(this.deck);
    this.combos = populateCombos();
    this.tokens = populateTokens();
    this.timer = new Timer(this.players);
    this._currentTurn = 0;
    this.currentPlayer = this.players[0];

    console.log("Initialized game");
  }

  turn() {
    this._currentTurn = (this._currentTurn + 1) % this.players.length;
    this.currentPlayer = this.players[this._currentTurn];
    // console.log(this.tokens.toString());
  }

  applyAction(action) {
    if (this.currentPlayer.id === action.playerId) {
      const message = action.apply(this);
      if (message.error) {
        return message;
      }
      this.turn();
      return message;
    }
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

  printMarket() {
    for (let i = 0; i < 3; i++) {
      console.log(`Tier ${i}`);
      this.market[i].forEach(i => console.log(i.toString()));
    }
  }

  removeCardById(id) {
    return this.removeCard(this.getCardById(id));
  }

  removeCard(card) {
    let found = false;
    if (this.deck[card.tier - 1].includes(card)) {
      const index = this.deck[card.tier - 1].indexOf(card);
      this.deck[card.tier - 1].splice(index, 1);
      found = true;
    }
    if (this.market[card.tier - 1].includes(card)) {
      const index = this.market[card.tier - 1].indexOf(card);
      this.market[card.tier - 1].splice(index, 1);
      found = true;
    }
    if (!found) throw new Error("Attempted removal of a card not in deck");
  }

  removeCardFromMarket(card) {
    if (this.hasCardInMarket(card)) {
      const tier = card.tier;
      const index = this.market[tier - 1].indexOf(card);
      this.market[tier - 1].splice(index, 1);
      const newCard = this.deck[tier - 1].pop();
      if (newCard) this.market[tier - 1].push(newCard);
    } else {
      throw new Error("Card not in market");
    }
  }

  getCardById(id) {
    const marketCard = this.cards
      .reduce((acc, item) => acc.concat(item), [])
      .filter(card => card.id == id);
    return marketCard[0];
  }

  hasCard(card) {
    return this.deck.find(i => i.includes(card)) !== -1;
  }

  hasCardInMarket(card) {
    return this.market.some(i => i.includes(card));
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(jsonString) {
    const game = new Game(0);
    const obj = JSON.parse(jsonString);

    game.id = obj.id;
    game.players = obj.players.map(Player.parse);
    game.cards = Array.from(obj.cards).map(item => item.map(Card.parse));
    game.deck = Array.from(obj.deck).map(item => item.map(Card.parse));
    // console.log("MARKET");
    // console.log(obj.market);
    // console.log(Array.from(obj.market).map(item => item.map(Card.parse)));
    game.market = Array.from(obj.market).map(item => item.map(Card.parse));
    game.tokens = Tokens.parse(obj.tokens);
    game.combos = obj.combos.map(Combo.parse);
    game.history = obj.history;
    game.state = obj.state;
    game.winners = obj.winners;
    game._currentTurn = obj._currentTurn;
    game.currentPlayer = obj.currentPlayer;
    game.timer = Timer.parse(obj.timer);

    return game;
  }

  isEnded() {
    return this.state === State.End;
  }

  getPlayerById(id) {
    return this.players.filter(p => p.id == id)[0];
  }
}

module.exports = Game;
