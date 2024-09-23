import { d2CrudPlus } from 'd2-crud-plus'
import group from './group'

function install (Vue, options) {
  Vue.component('values-popover', () => import('./values-popover'))
  if (d2CrudPlus != null) {
    // نوع حقل التسجيل`demo-extend`
    d2CrudPlus.util.columnResolve.addTypes(group)
  }
}
// يصدّرinstall
export default {
  install
}
