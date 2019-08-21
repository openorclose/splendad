const { Tokens } = require("../src/token");
let t = new Tokens([1, 2, 3, 4, 5]);
const one = new Tokens([1, 1, 1, 1, 1]);
const empty = new Tokens();

test("equality", () => {
  expect(t).toStrictEqual(t);
  expect(t).toStrictEqual(new Tokens([1, 2, 3, 4, 5]));
});

test("add/removing tokens", () => {
  expect(t.remove(one)).toStrictEqual(new Tokens([0, 1, 2, 3, 4]));
  expect(t.add(one)).toStrictEqual(new Tokens([2, 3, 4, 5, 6]));
});
