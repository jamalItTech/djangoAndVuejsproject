import Vue from 'vue'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    // مقاس
    value: '' // medium small mini
  },
  actions: {
    /**
     * @description تطبيق الإعدادات الحالية على element
     * @param {Object} context
     * @param {Boolean} refresh هي الصفحة تحديث الصفحة بعد الإعداد
     */
    apply ({ state, commit }, refresh) {
      Vue.prototype.$ELEMENT.size = state.value
      if (refresh) {
        commit('d2admin/page/keepAliveClean', null, { root: true })
        router.replace('/refresh')
      }
    },
    /**
     * @description تأكد من تحميل المكونمقاسيثبت https://github.com/d2-projects/d2-admin/issues/198
     * @param {Object} context
     */
    isLoaded ({ state }) {
      if (state.value) return Promise.resolve()
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (state.value) resolve(clearInterval(timer))
        }, 10)
      })
    },
    /**
     * @description يثبتمقاس
     * @param {Object} context
     * @param {String} size مقاس
     */
    async set ({ state, dispatch }, size) {
      // store تكليف
      state.value = size
      // طلب
      dispatch('apply', true)
      // متينة
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'size.value',
        value: state.value,
        user: true
      }, { root: true })
    },
    /**
     * @description منمتينةقراءة البياناتمقاسيثبت
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store تكليف
      state.value = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'size.value',
        defaultValue: 'default',
        user: true
      }, { root: true })
      // طلب
      dispatch('apply')
    }
  }
}
