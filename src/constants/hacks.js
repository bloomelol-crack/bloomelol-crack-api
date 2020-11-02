/** @typedef {object} Licence @property {number} price @property {number} months */

/** @param {string} code @param {string} name @param {Licence[]} licences  */
const getHack = (code, name, licences) => ({ code, name, licences });

/** @param {number} price @param {number} months @returns {Licence}  */
const getLicence = (price, months) => ({ price, months });

export const HACKS = {
  AOE2: getHack('AOE2', 'Age Of Empires II', [
    getLicence(1.5, 1),
    getLicence(2.5, 2),
    getLicence(4, 6),
    getLicence(7, 12)
  ]),
  FNAF2: getHack('FNAF2', "Five Nights At Freddy's 2 Multiplayer", [
    getLicence(1.5, 1),
    getLicence(2.5, 2),
    getLicence(4, 6),
    getLicence(7, 12)
  ]),
  CS1_6: getHack('CS1_6', 'Counter Strike 1.6', [
    getLicence(1.5, 1),
    getLicence(2.5, 2),
    getLicence(4, 6),
    getLicence(7, 12)
  ])
};
