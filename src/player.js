const { blankTokenMap } = require("./util.js");

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.boughtCards = [];
    this.reservedCards = [];
    this.boughtCombos = [];
    this.tokens = blankTokenMap();
    this.points = 0;
    this.isHost = false;
  }

  addTokens(tokens) {
    for (const i of tokens) {
      console.log(i);
    }
  }
}

module.exports = Player;
