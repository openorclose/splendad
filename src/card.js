class Card {
  constructor(tier, color, cost, points) {
    this.tier = tier;
    this.color = color;
    this.cost = cost;
    this.points = points;
  }

  toString() {
    return (
      `T${this.tier} ${Symbol.keyFor(this.color)}(${this.points})` +
      Array.from(this.cost.values())
    );
  }
}

module.exports = Card;
