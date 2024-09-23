import { request } from '@/api/service'
const urlPrefix = '/api/system/menu_button/get_btn_permission/'
export default {
  namespaced: true,
  state: {
    // رسالة غير معقولة
    data: []
  },
  getters: {
    permissionList (state) {
      return state.data
    }
  },
  actions: {
    /**
     * @description الحصول على البيانات
     * @param {Object} context
     * @param {String} param message {String} معلومة
     * @param {String} param type {String} يكتب
     * @param {Object} payload meta {Object} مُرفَقمعلومة
     */
    async load ({
      state,
      commit
    }) {
      request({
        url: urlPrefix,
        method: 'get',
        params: {}
      }).then(res => {
        const { data } = res
        commit('set', data)
      })
    }
  },
  mutations: {
    /**
     * تعيين بيانات السلطة
     * @param state
     * @param number
     */
    async set (state, data) {
      state.data = data
    }
  }
}
