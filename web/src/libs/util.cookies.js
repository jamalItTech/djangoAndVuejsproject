import Cookies from 'js-cookie'

const cookies = {}

/**
 * @description تخزين cookie قيمة
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} setting cookie setting
 */
cookies.set = function (name = 'default', value = '', cookieSetting = {}) {
  const currentCookieSetting = {
    expires: 1
  }
  Object.assign(currentCookieSetting, cookieSetting)
  Cookies.set(`d2admin-${process.env.VUE_APP_VERSION}-${name}`, value, currentCookieSetting)
}

/**
 * @description يحصل cookie قيمة
 * @param {String} name cookie name
 */
cookies.get = function (name = 'default') {
  window.dvAdminToken = Cookies.get(`d2admin-${process.env.VUE_APP_VERSION}-${name}`)
  return window.dvAdminToken
}

/**
 * @description يحصل cookie كل شيءقيمة
 */
cookies.getAll = function () {
  return Cookies.get()
}

/**
 * @description يمسح cookie
 * @param {String} name cookie name
 */
cookies.remove = function (name = 'default') {
  return Cookies.remove(`d2admin-${process.env.VUE_APP_VERSION}-${name}`)
}

export default cookies
