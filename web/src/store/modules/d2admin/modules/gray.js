export default {
  namespaced: true,
  state: {
    // رمادي
    active: false
  },
  mutations: {
    /**
     * @description يُحوّلرماديولاية
     * @param {Object} state state
     */
    toggle (state) {
      state.active = !state.active
    },
    /**
     * @description يثبترمادينموذج
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set (state, active) {
      state.active = active
    }
  }
}
