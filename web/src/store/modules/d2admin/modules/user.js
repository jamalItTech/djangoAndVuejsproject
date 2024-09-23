export default {
  namespaced: true,
  state: {
    // معلومات المستخدم
    info: {}
  },
  actions: {
    /**
     * @description تعيين بيانات المستخدم
     * @param {Object} context
     * @param {*} info info
     */
    async set ({ state, dispatch }, info) {
      // store تكليف
      state.info = info
      // متينة
      // await dispatch('d2admin/db/set', {
      //   dbName: 'sys',
      //   path: 'user.info',
      //   value: info,
      //   user: true
      // }, { root: true })
    },
    /**
     * @description خذ بيانات المستخدم من قاعدة البيانات
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store تكليف
      // state.info = await dispatch('d2admin/db/get', {
      //   dbName: 'sys',
      //   path: 'user.info',
      //   defaultValue: {},
      //   user: true
      // }, { root: true })
    }
  }
}
