import screenfull from 'screenfull'

export default {
  namespaced: true,
  state: {
    // تفعيل كامل الشاشة
    active: false
  },
  actions: {
    /**
     * @description مشرف التهيئة الاستماع
     * @param {Object} context
     */
    listen ({ commit }) {
      if (screenfull.isEnabled) {
        screenfull.on('change', () => {
          if (!screenfull.isFullscreen) commit('set', false)
        })
      }
    },
    /**
     * @description تبديل ملء الشاشة
     * @param {Object} context
     */
    toggle ({ commit }) {
      if (screenfull.isFullscreen) {
        screenfull.exit()
        commit('set', false)
      } else {
        screenfull.request()
        commit('set', true)
      }
    }
  },
  mutations: {
    /**
     * @description يثبت store حالة ملء الشاشة
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set (state, active) {
      state.active = active
    }
  }
}
