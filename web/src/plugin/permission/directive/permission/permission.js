/*
 * @إنشاء وقت الملف: 2021-06-27 10:14:26
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-07-27 23:00:10
 * يتصلQq:1638245306
 * @مقدمة الملف: تعليمات مخصصة-التحكم في الإذن
 */
import permissionUtil from './util.permission'
export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    const hasPermission = permissionUtil.hasPermissions(value)
    if (process.env.VUE_APP_PM_ENABLED) {
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
