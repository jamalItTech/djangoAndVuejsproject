// ضبط الملف
import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    // أعلى القائمة بقطر
    header: [],
    // قائمة الجانبية
    aside: [],
    // الشريط الجانبي انكماش
    asideCollapse: setting.menu.asideCollapse,
    // الرسوم المتحركة القابلة للطي على الشريط الجانبي
    asideTransition: setting.menu.asideTransition
  },
  actions: {
    /**
     * اضبط الشريط الجانبي للتوسع أو التقلص
     * @param {Object} context
     * @param {Boolean} collapse is collapse
     */
    async asideCollapseSet ({ state, dispatch }, collapse) {
      // store تكليف
      state.asideCollapse = collapse
      // متينة
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * قم بتبديل الشريط الجانبي للتوسع والانكماش
     * @param {Object} context
     */
    async asideCollapseToggle ({ state, dispatch }) {
      // store تكليف
      state.asideCollapse = !state.asideCollapse
      // متينة
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * يثبتالرسوم المتحركة القابلة للطي على الشريط الجانبي
     * @param {Object} context
     * @param {Boolean} transition is transition
     */
    async asideTransitionSet ({ state, dispatch }, transition) {
      // store تكليف
      state.asideTransition = transition
      // متينة
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: state.asideTransition,
        user: true
      }, { root: true })
    },
    /**
     * يُحوّلالرسوم المتحركة القابلة للطي على الشريط الجانبي
     * @param {Object} context
     */
    async asideTransitionToggle ({ state, dispatch }) {
      // store تكليف
      state.asideTransition = !state.asideTransition
      // متينة
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: state.asideTransition,
        user: true
      }, { root: true })
    },
    /**
     * متينة数据加载侧边栏يثبت
     * @param {Object} context
     */
    async asideLoad ({ state, dispatch }) {
      // store تكليف
      const menu = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'menu',
        defaultValue: setting.menu,
        user: true
      }, { root: true })
      state.asideCollapse = menu.asideCollapse !== undefined ? menu.asideCollapse : setting.menu.asideCollapse
      state.asideTransition = menu.asideTransition !== undefined ? menu.asideTransition : setting.menu.asideTransition
    }
  },
  mutations: {
    /**
     * @description يثبتأعلى القائمة بقطر
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    headerSet (state, menu) {
      // store تكليف
      state.header = menu
    },
    /**
     * @description اضبط قائمة الشريط الجانبي
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    asideSet (state, menu) {
      // store تكليف
      state.aside = menu
    }
  }
}
