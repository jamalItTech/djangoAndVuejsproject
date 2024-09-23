import { get } from 'lodash'
import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    // سمة
    list: get(setting, 'theme.list', []),
    // تم تنشيطه الآنسمة يجب أن يكون هذا اسمًا ليس كائن
    activeName: get(setting, 'theme.list[0].name', 'd2')
  },
  getters: {
    /**
     * @description إرجاع التيارسمةمعلومة ليس اسمًا لكن التنشيط الحاليسمةجميع البيانات
     * @param {Object} state state
     */
    activeSetting (state) {
      return state.list.find(theme => theme.name === state.activeName)
    }
  },
  actions: {
    /**
     * @description تنشيط واحدسمة
     * @param {String} themeValue تحتاج إلى تنشيطسمةاسم
     */
    async set ({ state, commit, dispatch }, themeName) {
      // تحقق من هذاسمةيخرجسمة列表里是否存يخرج
      state.activeName = state.list.find(e => e.name === themeName) ? themeName : state.list[0].name
      // سوف vuex واسطةسمةتنطبق على dom
      commit('dom')
      // متينة
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'theme.activeName',
        value: state.activeName,
        user: true
      }, { root: true })
    },
    /**
     * @description منمتينةتحميل البياناتسمةيثبت     * @param {Object} context
     */
    async load ({ state, commit, dispatch }) {
      // store تكليف
      const activeName = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'theme.activeName',
        defaultValue: state.list[0].name,
        user: true
      }, { root: true })
      // تحقق من هذاسمةيخرجسمة列表里是否存يخرج
      if (state.list.find(e => e.name === activeName)) {
        state.activeName = activeName
      } else {
        state.activeName = state.list[0].name
        // متينة
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'theme.activeName',
          value: state.activeName,
          user: true
        }, { root: true })
      }
      // سوف vuex واسطةسمةتنطبق على dom
      commit('dom')
    }
  },
  mutations: {
    /**
     * @description سوف vuex واسطةسمةتنطبق على dom
     * @param {Object} state state
     */
    dom (state) {
      document.body.className = `theme-${state.activeName}`
    }
  }
}
