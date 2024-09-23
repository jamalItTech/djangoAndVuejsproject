import store from '@/store'
import util from '@/libs/util'

export default {
  install (Vue, options) {
    // طباعة بسرعة log
    Vue.prototype.$log = {
      ...util.log,
      push (data) {
        if (typeof data === 'string') {
          // إذا كانت البيانات التي تم تمريرها هي سلسلة
          // تعيين message مجال
          // لتسهيل الاستخدام
          // eg: this.$log.push('foo text')
          store.dispatch('d2admin/log/push', {
            message: data
          })
        } else if (typeof data === 'object') {
          // إذا كانت البيانات التي تم تمريرها كائن
          store.dispatch('d2admin/log/push', data)
        }
      }
    }
  }
}
