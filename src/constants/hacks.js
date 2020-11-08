/** @typedef {object} Licence @property {number} price @property {number} sessionCoef
 * @property {number} months */

/** @typedef {object} Hack
 * @property {string} code @property {string} name @property {number} testDays
 * @property {Licence[]} licences */

/** @param {Hack} hack @returns {Hack}  */
const getHack = hack => hack;

export const HACKS = {
  LOL_LEVELING_BOT: getHack({
    code: 'LOL_LEVELING_BOT',
    name: 'LOL Leveling Bot',
    testDays: 7,
    licences: [
      { price: 1.5, sessionCoef: 1.08, months: 1 },
      { price: 2.5, sessionCoef: 1.08, months: 3 },
      { price: 3.5, sessionCoef: 1.08, months: 6 },
      { price: 5, sessionCoef: 1.08, months: 12 }
    ]
  }),
  AOE2: getHack({
    code: 'AOE2',
    name: 'Age Of Empires II',
    testDays: 0,
    licences: [
      { price: 1.5, sessionCoef: 0, months: 1 },
      { price: 2.5, sessionCoef: 0, months: 2 },
      { price: 4, sessionCoef: 0, months: 6 },
      { price: 7, sessionCoef: 0, months: 12 }
    ]
  }),
  FNAF2: getHack({
    code: 'FNAF2',
    name: "Five Nights At Freddy's 2 Multiplayer",
    testDays: 0,
    licences: [
      { price: 1.5, sessionCoef: 0, months: 1 },
      { price: 2.5, sessionCoef: 0, months: 2 },
      { price: 4, sessionCoef: 0, months: 6 },
      { price: 7, sessionCoef: 0, months: 12 }
    ]
  }),
  CS1_6: getHack({
    code: 'CS1_6',
    name: 'Counter Strike 1.6',
    testDays: 0,
    licences: [
      { price: 1.5, sessionCoef: 0, months: 1 },
      { price: 2.5, sessionCoef: 0, months: 2 },
      { price: 4, sessionCoef: 0, months: 6 },
      { price: 7, sessionCoef: 0, months: 12 }
    ]
  })
};
