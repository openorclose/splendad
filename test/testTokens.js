const { Tokens } = require("../src/token");

function test() {
  let t = new Tokens([1, 2, 3, 4, 5]);
  const one = new Tokens([1, 1, 1, 1, 1]);
  const empty = new Tokens();
  console.log(t.toString(), t.total());
  t = t.remove(one);
  console.log(t.toString(), t.total());
}

test();
