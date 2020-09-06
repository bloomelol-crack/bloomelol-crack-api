module.exports = Object.freeze({
  receive: { GET_PACKS: 'GET_PACKS' },
  emit: {
    GET_PACK_SUCCESS: 'GET_PACK_SUCCESS',
    GET_PACK_FAILURE: 'GET_PACK_SUCCESS'
  },
  broadcast: {
    PACK_IN_STOCK: 'PACK_IN_STOCK',
    PACK_OUT_OF_STOCK: 'PACK_OUT_OF_STOCK'
  }
});
