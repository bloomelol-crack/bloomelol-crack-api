module.exports = Object.freeze({
  receive: { GET_PACKS: 'GET_PACKS' },
  emit: {
    GET_PACKS_SUCCESS: 'GET_PACKS_SUCCESS',
    GET_PACKS_FAILURE: 'GET_PACKS_FAILURE'
  },
  broadcast: {
    PACK_IN_STOCK: 'PACK_IN_STOCK',
    PACK_OUT_OF_STOCK: 'PACK_OUT_OF_STOCK',
    PACKS_UPDATED: 'PACKS_UPDATED'
  }
});
