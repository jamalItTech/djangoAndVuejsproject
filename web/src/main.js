/*
 * @إنشاء وقت الملف: 2021-06-01 22:41:19
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-08-12 00:57:05
 * يتصلQq:1638245306
 * @مقدمة الملف:
 */
// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// المكونات الأساسية -في
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// إعدادات القائمة والإرشاد
import router from './router'
import { menuHeader } from '@/menu'

// إذن زر
import '@/plugin/permission' // حمولةpermission

// d2-crud-plus التثبيت والتهيئة
import './install'
// إعداداتvxe-table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

// md5التشفير
import md5 from 'js-md5'

// websocket
import websocket from '@/api/websocket'
import util from '@/libs/util'
import VueCoreVideoPlayer from 'vue-core-video-player'
// يقدمecharts
import * as echarts from 'echarts' // يسجلechartsعنصر
// طرف ثالثعنصر
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.use(VueCoreVideoPlayer)
// المكونات الأساسية -في
Vue.use(d2Admin)
Vue.use(VXETable)
Vue.prototype.$md5 = md5
Vue.prototype.$util = util
Vue.prototype.$websocket = websocket
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  beforeCreate () {
    // التهيئةإعدادات
    this.$store.dispatch('d2admin/settings/load')
    this.$store.dispatch('d2admin/dictionary/load')
  },
  created () {

    // التوجيه معالجة كل مستوى من إعدادات الطريق
    // this.$store.commit('d2admin/page/init', frameInRoutes)
    // قم بتعيين قائمة Topbelled
    // this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // اضبط قائمة الشريط الجانبي
    // this.$store.commit('d2admin/menu/asideSet', menuAside)
    // وظيفة بحث القائمة المهيئة
    // this.$store.commit('d2admin/search/init', menuAside)
  },
  mounted () {
    // عرض معلومات النظام
    this.$store.commit('d2admin/releases/versionShow')
    // تسجيل الدخول المستخدم من قاعدة البياناتحمولةسلسلة من الإعدادات
    this.$store.dispatch('d2admin/account/load')
    // احصل على المستخدم وتسجيله UA
    this.$store.commit('d2admin/ua/get')
    // تهيئة المراقبة الكاملة الشاشة
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    // اكتشف تغيير التوجيه لتبديل محتوى الشريط الجانبي
    '$route.matched': {
      handler (matched) {
        if (matched.length > 0) {
          const _side = menuHeader.filter(menu => menu.path === matched[0].path)
          if (_side.length > 0) {
            this.$store.commit('d2admin/menu/asideSet', _side[0].children)
          }
        }
      },
      immediate: true
    }
  }
}).$mount('#app')
