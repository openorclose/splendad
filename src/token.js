class Token {
  id;
  color;
  constructor(color) {
    this.color = color;
  }

  toString() {
    return this.color.toString();
  }
}

module.exports = Token;
