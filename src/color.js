let i = 0;
const Color = {
  Red: i++,
  Green: i++,
  Blue: i++,
  White: i++,
  Black: i++,
  Wildcard: i++
};

const ColorMap = {};
// for (let i in Color) {
//   ColorMap[Color[i]] = i;
// }

module.exports = { Color, ColorMap };
