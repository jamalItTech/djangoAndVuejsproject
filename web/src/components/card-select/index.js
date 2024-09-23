import { d2CrudPlus } from 'd2-crud-plus'
import group from './group'

function install (Vue, options) {
  Vue.component('card-select-form', () => import('./lib/card-select-form.vue'))
  if (d2CrudPlus != null) {
    // نوع حقل التسجيل`demo-extend`
    d2CrudPlus.util.columnResolve.addTypes(group)
  }
}
// يصدّرinstall
export default {
  install
}
