/** @typedef {object} Licence @property {number} price @property {number} months */
/** @typedef {object} Hack @property {string} code @property {string} name @property {Licence[]} licences */

/** @param {Hack} hack @returns {Hack}  */
const getHack = hack => hack;

export const HACKS = {
  AOE2: getHack({
    code: 'AOE2',
    name: 'Age Of Empires II',
    licences: [
      { price: 1.5, months: 1 },
      { price: 2.5, months: 2 },
      { price: 4, months: 6 },
      { price: 7, months: 12 }
    ]
  }),
  FNAF2: getHack({
    code: 'FNAF2',
    name: "Five Nights At Freddy's 2 Multiplayer",
    licences: [
      { price: 1.5, months: 1 },
      { price: 2.5, months: 2 },
      { price: 4, months: 6 },
      { price: 7, months: 12 }
    ]
  }),
  CS1_6: getHack({
    code: 'CS1_6',
    name: 'Counter Strike 1.6',
    licences: [
      { price: 1.5, months: 1 },
      { price: 2.5, months: 2 },
      { price: 4, months: 6 },
      { price: 7, months: 12 }
    ]
  })
};
