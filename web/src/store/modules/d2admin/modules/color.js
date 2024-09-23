import { cloneDeep } from 'lodash'
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'

export default {
  namespaced: true,
  state: {
    // لون
    value: process.env.VUE_APP_ELEMENT_COLOR
  },
  actions: {
    /**
     * @description يثبتلون
     * @param {Object} context
     * @param {String} color مقاس
     */
    async set ({ state, dispatch, commit }, color) {
      // سجل القيمة السابقة
      const old = state.value
      // store تكليف
      state.value = color || process.env.VUE_APP_ELEMENT_COLOR
      // متينة
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'color.value',
        value: state.value,
        user: true
      }, { root: true })
      // طلب
      commit('apply', {
        oldColor: old,
        newColor: state.value
      })
    },
    /**
     * @description منمتينةقراءة البياناتلونيثبت
     * @param {Object} context
     */
    async load ({ state, dispatch, commit }) {
      // سجل القيمة السابقة
      const old = state.value
      // store تكليف
      state.value = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'color.value',
        defaultValue: process.env.VUE_APP_ELEMENT_COLOR,
        user: true
      }, { root: true })
      // طلب
      commit('apply', {
        oldColor: old,
        newColor: state.value
      })
    }
  },
  mutations: {
    /**
     * @description سوف vuex سمةلونيثبتطلبللنظام
     * @param {Object} context
     * @param {Object} payload oldColor {String} قديملون
     * @param {Object} payload newColor {String} جديدلون
     */
    apply (state, { oldColor, newColor }) {
      var options = {
        oldColors: cloneDeep(forElementUI.getElementUISeries(oldColor)),
        newColors: cloneDeep(forElementUI.getElementUISeries(newColor))
      }
      client.changer.changeColor(options)
    }
  }
}
