const { Tokens } = require("./token.js");

class Card {
  constructor(tier, color, cost, points, id) {
    this.tier = tier;
    this.color = color;
    this.cost = cost;
    this.points = points;
    this.id = id || Card.getNewId();
  }

  toString() {
    return (
      `[${this.id}] T${this.tier} ${Symbol.keyFor(this.color)}(${
        this.points
      }) ` + this.cost.toString()
    );
  }

  static getNewId() {
    this._id++;
    return this._id;
  }

  static parse(obj) {
    return new Card(
      obj.tier,
      obj.color,
      Tokens.parse(obj.cost),
      obj.points,
      obj.id
    );
  }
}

Card._id = 0;

module.exports = Card;
