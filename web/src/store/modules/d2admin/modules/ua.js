import UaParser from 'ua-parser-js'

export default {
  namespaced: true,
  state: {
    // مستخدم UA
    data: {}
  },
  mutations: {
    /**
     * @description سِجِلّ UA
     * @param {Object} state state
     */
    get (state) {
      state.data = new UaParser().getResult()
    }
  }
}
