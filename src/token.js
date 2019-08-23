const Exceptions = require("./exceptions.js");

class Tokens {
  constructor(array) {
    if (!array || array.length === 0) {
      return new Tokens([0, 0, 0, 0, 0, 0]);
    }

    if (array.length !== 6) {
      throw new Exceptions.InvalidTokensFormatException();
    }
    this.array = array;
    [
      this.red,
      this.green,
      this.blue,
      this.white,
      this.black,
      this.wild
    ] = array;
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
      throw new Error("Negative tokens");
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
    const cols = "R,G,B,W,K,*".split(",");
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

const Token = {
  Red: new Tokens([1, 0, 0, 0, 0, 0]),
  Green: new Tokens([0, 1, 0, 0, 0, 0]),
  Blue: new Tokens([0, 0, 1, 0, 0, 0]),
  White: new Tokens([0, 0, 0, 1, 0, 0]),
  Black: new Tokens([0, 0, 0, 0, 1, 0]),
  Wild: new Tokens([0, 0, 0, 0, 0, 1])
};

module.exports = { Token, Tokens };
