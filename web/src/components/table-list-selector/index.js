/*
 * @إنشاء وقت الملف: 2021-08-02 23:56:15
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-08-09 22:15:56
 * يتصلQq:1638245306
 * @مقدمة الملف:
 */
import { d2CrudPlus } from 'd2-crud-plus'
import group from './group'

function install (Vue, options) {
  Vue.component('table-list-selector-input', () => import('./table-list-selector'))
  // Vue.component('d2p-row-format', () => import('./row'))
  if (d2CrudPlus != null) {
    // نوع حقل التسجيل`demo-extend`
    d2CrudPlus.util.columnResolve.addTypes(group)
  }
}

// يصدّرinstall， يمر`vue.use(D2pDemoExtend)`بعد التثبيت ，`demo-extend` أنت تستطيع`crud.js`يستخدم
export default {
  install
}
