/*
 * @إنشاء وقت الملف: 2021-06-01 22:41:21
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-08-13 00:06:07
 * يتصلQq:1638245306
 * @مقدمة الملف: تسجيل الدخول وتسجيل الدخول
 */
import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import store from '@/store/index'
import { SYS_USER_LOGIN, SYS_USER_LOGOUT } from '@/views/system/login/api'
import { request } from '@/api/service'

export default {
  namespaced: true,
  actions: {
    /**
     * @description تسجيل الدخول
     * @param {Object} context
     * @param {Object} payload username {String} حساب المستخدم
     * @param {Object} payload password {String} كلمة المرور
     * @param {Object} payload route {Object} تسجيل الدخولكائن التوجيه بعد النجاح أي vue-router تنسيق الدعم
     */
    async login ({ dispatch }, {
      username = '',
      password = '',
      captcha = '',
      captchaKey = ''
    } = {}) {
      let res = await SYS_USER_LOGIN({
        username,
        password,
        captcha,
        captchaKey
      })
      // يثبت cookie يجب تخزينها uuid و token اثنين cookie
      // يعتمد النظام بأكمله على هذااثنينالتحقق من البياناتوتخزين
      // uuid إنها الهوية الوحيدة لهوية المستخدم طيب عندما يتم تسجيل المستخدم ولا يمكن تغييرها لا يمكن تكرارها
      // token يمثل المستخدم الحاليتسجيل الدخولولاية يوصى بالحمل في طلب الشبكة token
      // إذا لزم الأمر token بحاجة إلى التحديث بانتظام，احفظ يوم افتراضي
      res = res.data
      util.cookies.set('uuid', res.userId)
      util.cookies.set('token', res.access)
      util.cookies.set('refresh', res.refresh)
      // يثبت vuex معلومات المستخدم
      // await dispatch('d2admin/user/set', {
      //   name: res.name,
      //   user_id: res.userId,
      //   avatar: res.avatar,
      //   role_info: res.role_info,
      //   dept_info: res.dept_info
      // }, { root: true })
      var userInfoRes = await request({
        url: '/api/system/user/user_info/',
        method: 'get',
        params: {}
      })
      await store.dispatch('d2admin/user/set', userInfoRes.data, { root: true })
      // مستخدمتسجيل الدخولتحميل سلسلة من البيانات المستمرةيثبت
      await dispatch('load')
    },
    /**
     * @description يلغيمستخدم并返回تسجيل الدخولصفحة
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} هل تحتاج إلى التأكيد
     */
    logout ({ commit, dispatch }, { confirm = false, refresh = true } = {}) {
      /**
       * @description يلغي
       */
      async function logout () {
        await SYS_USER_LOGOUT({ refresh: util.cookies.get('refresh') }).then(() => {
          // يمسحcookie
          util.cookies.remove('token')
          util.cookies.remove('uuid')
          util.cookies.remove('refresh')
        })
        // فارغ vuex معلومات المستخدم
        await dispatch('d2admin/user/set', {}, { root: true })
        store.commit('d2admin/menu/asideSet', []) // يثبتقائمة الشريط الجانبي
        store.commit('d2admin/search/init', []) // يثبتيبحث
        sessionStorage.removeItem('menuData')

        store.dispatch('d2admin/db/databaseClear')

        // طريق القفز
        router.push({ name: 'login' })
        if (refresh) {
          router.go(0)
        }
      }
      // يحكم علىهل تحتاج إلى التأكيد
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('يحدديلغي当前مستخدم吗', 'يلغيمستخدم', { type: 'warning' })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({ message: 'يلغييلغيتعمل' })
          })
      } else {
        logout()
      }
    },
    /**
         * @description مستخدمتسجيل الدخولتحميل سلسلة من البيانات المستمرةيثبت
         * @param {Object} context
         */
    async load ({ dispatch }) {
      // تحميل اسم المستخدم
      await dispatch('d2admin/user/load', null, { root: true })
      // موضوع تحميل
      await dispatch('d2admin/theme/load', null, { root: true })
      // 加载صفحة过渡效果يثبت
      await dispatch('d2admin/transition/load', null, { root: true })
      // تقوم البيانات المتينة بتحميل قائمة Multi -Page للخروج الأخير
      await dispatch('d2admin/page/openedLoad', null, { root: true })
      // تحميل البيانات تكوين الشريط الجانبي للشريط الجانبي
      await dispatch('d2admin/menu/asideLoad', null, { root: true })
      // تقوم بيانات البيانات المتينة بتحميل الحجم العالمي
      await dispatch('d2admin/size/load', null, { root: true })
      // لون تحميل البيانات للبيانات المتينةيثبت
      await dispatch('d2admin/color/load', null, { root: true })
    }
  }
}
