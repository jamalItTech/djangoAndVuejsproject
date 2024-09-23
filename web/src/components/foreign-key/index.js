import { d2CrudPlus } from 'd2-crud-plus'
import group from './group'

function install (Vue, options) {
  Vue.component('foreign-key', () => import('./index'))
  if (d2CrudPlus != null) {
    // نوع حقل التسجيل`demo-extend`
    d2CrudPlus.util.columnResolve.addTypes(group)
  }
}

// يصدّرinstall， يمر`vue.use(D2pDemoExtend)`بعد التثبيت ，`demo-extend` أنت تستطيع`crud.js`يستخدم
export default {
  install
}
