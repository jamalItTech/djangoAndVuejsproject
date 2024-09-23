// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// flex مكتبة التصميم
import 'flex.css'
// عنصر
import '@/components'
// svg رمز
import '@/assets/svg-icons'
// تدويل
import i18n from '@/i18n.js'

// قابس الوظيفة -في
import pluginApi from '@/plugin/api'
import pluginError from '@/plugin/error'
import pluginLog from '@/plugin/log'
import pluginOpen from '@/plugin/open'
import tableSelector from '@/components/table-selector/index'
export default {
  async install (Vue, options) {
    // تعيين إلى false لمنع vue توليد مطالبات الإنتاج أثناء بدء التشغيل
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // البيئة الحالية
    Vue.prototype.$env = process.env.NODE_ENV
    // حاضِر baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL
    // الإصدار الحالي
    Vue.prototype.$version = process.env.VUE_APP_VERSION
    // بناء الوقت
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME
    // Element
    Vue.use(ElementUI, {
      i18n: (key, value) => i18n.t(key, value)
    })
    // قابس -في
    Vue.use(pluginApi)
    Vue.use(pluginError)
    Vue.use(pluginLog)
    Vue.use(pluginOpen)
    Vue.use(tableSelector)
  }
}
