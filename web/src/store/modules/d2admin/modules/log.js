import dayjs from 'dayjs'
import { get } from 'lodash'
import util from '@/libs/util.js'

export default {
  namespaced: true,
  state: {
    // سجل الخطأ
    // + سمة وجهة الشريط السجل
    //   - message يجب تسجيل المعلومات
    //   - type لايجب يكتب success | warning | info(تقصير) | danger
    //   - time يجب وقت التسجيل
    //   - meta لايجب معلومات محمولة أخرى
    log: []
  },
  getters: {
    /**
     * @description إرجاع موجود log (all) رقم
     * @param {*} state vuex state
     */
    length (state) {
      return state.log.length
    },
    /**
     * @description إرجاع موجود log (error) رقم
     * @param {*} state vuex state
     */
    lengthError (state) {
      return state.log.filter(log => log.type === 'danger').length
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
    push ({ rootState, commit }, { message, type = 'info', meta }) {
      commit('push', {
        message,
        type,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        meta: {
          // المستخدم الحاليمعلومة
          user: rootState.d2admin.user.info,
          // المستخدم الحالي uuid
          uuid: util.cookies.get('uuid'),
          // حاضِر token
          token: util.cookies.get('token'),
          // العنوان الحالي
          url: get(window, 'location.href', ''),
          // إعدادات المستخدم
          ...meta
        }
      })
    }
  },
  mutations: {
    /**
     * @description إضافة سجل
     * @param {Object} state state
     * @param {Object} log data
     */
    push (state, log) {
      state.log.push(log)
    },
    /**
     * @description سجل فارغ
     * @param {Object} state state
     */
    clean (state) {
      // store تكليف
      state.log = []
    }
  }
}
