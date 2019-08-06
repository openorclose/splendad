const {
  generateDeck,
  populateCombos,
  populateTokens,
  populateMarket
} = require("./util.js");

const Timer = require("./timer.js");

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
    this.deck = new Map();
    this.market = new Map();
    this.tokens = new Map();
    this.combos = [];
    this.history = [];
    this.state = State.PreInit;
    this.winners = [];

    console.log("Game constructor called");
  }

  addPlayer(player) {
    this.players.push(player);
  }

  init() {
    this.deck = generateDeck();
    this.market = populateMarket(this.deck);
    this.combos = populateCombos();
    this.tokens = populateTokens(this.players.length);
    this.timer = new Timer(this.players);

    console.log("Initialized game");
  }

  turn() {}

  applyAction(action) {
    action.apply(this);
  }
}

const State = {
  PreInit: Symbol("PreInit"),
  Start: Symbol("Start"),
  Round: Symbol("Round"),
  FinalRound: Symbol("FinalRound"),
  End: Symbol("End")
};

module.exports = Game;
