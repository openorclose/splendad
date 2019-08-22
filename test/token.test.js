const { Tokens } = require("../src/token");
let t = new Tokens([1, 2, 3, 4, 5]);
const one = new Tokens([1, 1, 1, 1, 1]);
const empty = new Tokens();

/**
 * Returns an array of length n with random integers less than m
 * @param n
 * @param m
 * @returns {Array}
 */
function randArray(n, m) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(Math.floor(Math.random() * m));
  }
  return out;
}

function addArray(a, b) {
  return a.map((i, index) => i + b[index]);
}

test("equality", () => {
  expect(t).toStrictEqual(t);
  expect(t).toStrictEqual(new Tokens([1, 2, 3, 4, 5]));
});

test("add/removing tokens", () => {
  expect(t.remove(one)).toStrictEqual(new Tokens([0, 1, 2, 3, 4]));
  expect(t.add(one)).toStrictEqual(new Tokens([2, 3, 4, 5, 6]));

  for (let i = 0; i < 100; i++) {
    const a = randArray(5, 5);
    const b = randArray(5, 5);
    expect(new Tokens(a).add(new Tokens(b))).toStrictEqual(
      new Tokens(addArray(a, b))
    );
  }
});
