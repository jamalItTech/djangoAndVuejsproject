import { request } from '@/api/service'

export const urlPrefix = '/api/init/settings/'

// تكوين النظام
export default {
  namespaced: true,
  state: {
    data: {}
  },
  actions: {
    /**
     * @description طلب أحدث تكوين
     * @param {Object} context
     */
    async init ({ state, dispatch, commit }) {
      // طلب التكوين
      request({
        url: urlPrefix,
        method: 'get'
      }).then(async res => {
        // تكليف
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'settings.init',
          value: res.data,
          user: true
        }, { root: true })
        dispatch('load')
      })
    },
    /**
     * @description التحميل المحلي
     * @param {Object} context
     */
    async load ({ state, dispatch, commit }) {
      // store تكليف
      const data = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'settings.init',
        defaultValue: {},
        user: true
      }, { root: true })
      commit('set', data)
    }
  },
  mutations: {
    /**
     * @description الحصول على التكوين
     * @param {Object} state state
     * @param {String} key active
     * @param {Object} value active
     */
    async get (state, key, value) {
      return state[key]
    },
    /**
     * @description تكليفتكوين النظام
     * @param {Object} state state
     * @param {Object} value active
     */
    async set (state, value) {
      state.data = value
      state.keepRecord = value['login.keep_record']
      return state.data
    }
  }
}
