import { request } from '@/api/service'
export default {
  namespaced: true,
  state: {
    // رسالة غير معقولة
    unread: 0
  },
  getters: {
    unread (state) {
      return state.unread
    }
  },
  actions: {
    /**
     * @description إضافة سجل
     * @param {Object} context
     * @param {String} param message {String} معلومة
     * @param {String} param type {String} يكتب
     * @param {Object} payload meta {Object} مُرفَقمعلومة
     */
    async setUnread ({
      state,
      commit
    }, number) {
      if (number) {
        commit('set', number)
      } else {
        request({
          url: '/api/system/message_center/get_unread_msg/',
          method: 'get',
          params: {}
        }).then(res => {
          const { data } = res
          commit('set', data.count)
        })
      }
    }
  },
  mutations: {
    /**
     * يثبترسالة غير معقولة
     * @param state
     * @param number
     */
    async set (state, number) {
      state.unread = number
    }
  }
}
