/**
 * Waits the specified milliseconds and resolves
 * @param {number} milliseconds Milliseconds to wait
 */
const wait = async milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

module.exports = { wait };
