const Exceptions = require("./exceptions.js");

class Token {
  constructor(color) {
    this.color = color;
  }

  toString() {
    return this.color.toString();
  }

  static parse(obj) {
    return new Token(obj.color);
  }
}

class Tokens {
  constructor(array) {
    if (!array || array.length === 0) {
      return new Tokens([0, 0, 0, 0, 0]);
    }

    if (array.length !== 5) {
      throw new Exceptions.InvalidTokensFormatException();
    }
    this.array = array;
    [this.red, this.green, this.blue, this.white, this.black] = array;
  }

  add(tokens) {
    return new Tokens(
      this.array.map((item, index) => item + tokens.array[index])
    );
  }

  has(tokens) {
    return this.array.every((item, index) => item >= tokens.array[index]);
  }

  remove(tokens) {
    if (!this.has(tokens)) {
      throw new Exceptions.InsufficientTokensException();
    }
    return new Tokens(
      this.array.map((item, index) => item - tokens.array[index])
    );
  }

  equals(tokens) {
    return this.array.every((item, index) => item === tokens.array[index]);
  }

  total() {
    return this.array.reduce((acc, item) => acc + item, 0);
  }

  max() {
    return this.array.reduce((acc, item) => Math.max(acc, item), 0);
  }

  isEmpty() {
    return this.array.every(item => item === 0);
  }

  toString() {
    const cols = "R,G,B,W,K".split(",");
    return this.array
      .map((item, index) => [item, index])
      .filter(item => item[0] > 0)
      .map(([item, index]) => `${item}${cols[index]}`)
      .join(" ");
  }

  static parse(obj) {
    return new Tokens(obj.array);
  }
}

module.exports = { Token, Tokens };
