import store from '@/store'

import Vue from 'vue'
import permissionDirective from './directive/permission'

function isInited () {
  if (!isEnabled) {
    console.warn('PM is disabled')
    return true
  }
  return store.getters['permission/inited']
}

const isEnabled = process.env.VUE_APP_PM_ENABLED === 'true'
// وحدة الطاقة المفتوحة
if (isEnabled) {
  // يسجلv-permissionتعليمات, تستخدم للتحكم في أذونات الأزرار
  Vue.use(permissionDirective)
}

export default {
  isEnabled,
  isInited
}
