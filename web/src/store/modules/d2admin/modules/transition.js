// ضبط الملف
import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    // ما إذا كنت تفتح الصفحة فوقها
    active: setting.transition.active
  },
  actions: {
    /**
     * @description اضبط الحالة الافتتاحية
     * @param {Object} context
     * @param {Boolean} active دولة جديدة
     */
    async set ({ state, dispatch }, active) {
      // store تكليف
      state.active = active
      // متينة
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'transition.active',
        value: state.active,
        user: true
      }, { root: true })
    },
    /**
     * اقرأ من قاعدة البيانات لاختيار إعدادات الرسوم المتحركة لانتقال الصفحة
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store تكليف
      state.active = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'transition.active',
        defaultValue: setting.transition.active,
        user: true
      }, { root: true })
    }
  }
}
