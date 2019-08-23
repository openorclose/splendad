class Combo {
  constructor(requirements, points) {
    this.requirements = requirements;
    this.points = points;
  }

  static parse(obj) {
    return new Combo(obj.requirements, obj.points);
  }
}

module.exports = Combo;
