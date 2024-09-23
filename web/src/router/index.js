import Vue from 'vue'
import VueRouter from 'vue-router'
// شريط التقدم
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'
// بيانات المسار
import routes from './routes'
import { getMenu, handleAsideMenu, handleRouter, checkRouter } from '@/menu'
import { request } from '@/api/service'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
console.log(routes)
// طريق التصدير يخرج main.js يستخدم
const router = new VueRouter({
  routes
})

/**
 * اعتراض التوجيه
 * التحقق من إذن
 */
router.beforeEach(async (to, from, next) => {
  // القائمة البيضاء
  const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/clientRenew', '/oauth2']
  // تأكد من تحميل بيانات TOB المتعددة https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // تأكد من أن حجم المكون قد تم تحميله https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // شريط التقدم
  NProgress.start()
  // أغلق لوحة البحث
  store.commit('d2admin/search/set', false)
  // تحقق مما إذا كان هناك التحقق من تسجيل الدخول في جميع مطابقة التوجيه الحالي
  // هنا سيكون مؤقتًاcookieسواء كانت موجودة فيtokenكشرط للتحقق مما إذا كان سيتم تسجيل الدخول
  // يرجى تعديله وفقًا لعملك الخاص
  const token = util.cookies.get('token')
  if (token && token !== 'undefined') {
    if (!store.state.d2admin.user.info.name) {
      var res = await request({
        url: '/api/system/user/user_info/',
        method: 'get',
        params: {}
      })
      await store.dispatch('d2admin/user/set', res.data, { root: true })
      await store.dispatch('d2admin/account/load')
      store.dispatch('d2admin/settings/init')
    }
    if (!store.state.d2admin.menu || store.state.d2admin.menu.aside.length === 0) {
      await store.dispatch('d2admin/permission/load', routes)
      await store.dispatch('d2admin/dept/load')
      // إضافة الطريق ديناميكيا
      getMenu().then(ret => {
        // ما إذا كان التوجيه صالحًا
        ret = checkRouter(ret)
        const { routes, frameOut } = handleRouter(ret)
        // التوجيه معالجة كل مستوى من إعدادات الطريق
        store.commit('d2admin/page/init', routes)
        routes.map((r) => {
          router.addRoute(r)
        })
        frameOut.map((r) => {
          router.addRoute(r)
          router.options.routes.push(r)
        })
        console.log('router', router, routes, frameOut)
        // routes.forEach(route => router.addRoute(route))

        const menu = handleAsideMenu(ret)
        const aside = handleAsideMenu(ret.filter(value => value.visible === true))
        store.commit('d2admin/menu/asideSet', aside) // اضبط قائمة الشريط الجانبي
        store.commit('d2admin/search/init', menu) // تعيين البحث
        next({ path: to.fullPath, replace: true, params: to.params })
      })
    } else {
      const childrenPath = window.qiankunActiveRule || []
      // يحكم على，ما إذا كان وضع المستأجر
      if (to.path !== '/clientRenew' && store.state.d2admin.user.info.tenant_id) {
        // إذا انتهت صلاحية المستأجر，القفز إلى صفحة التجديد
        if (store.state.d2admin.user.info.tenant_expire) {
          next({ path: '/clientRenew' })
          // إلغاء التنقل الحالي
          NProgress.done()
          return
        // إذا كان مستأجرًا عاديًا，إذا لم تكن هناك حزمة تجريبية，ومرحلة التجربة
        } else if (store.state.d2admin.user.info.tenant_id !== 100000 && !store.state.d2admin.user.info.package_manage && store.state.d2admin.user.info.tenant_experience) {
          next({ path: '/clientRenew' })
          // إلغاء التنقل الحالي
          NProgress.done()
          return
        }
      }
      if (to.name) {
        if (to.meta.openInNewWindow && ((from.query.newWindow && to.query.newWindow !== '1') || from.path === '/')) {
          to.query.newWindow = '1'
        }

        // يملك name ملكية，التفسير هو طريق التطبيق الرئيسي
        if (to.meta.openInNewWindow && !to.query.newWindow && !from.query.newWindow && from.path !== '/') {
          // يخرجافتح الطريق في النافذة الجديدة
          const { href } = router.resolve({
            path: to.path + '?newWindow=1'
          })
          window.open(href, '_blank')
          // إلغاء التنقل الحالي
          NProgress.done()
          next(false)
        } else {
          // إلغاء التنقل الحالي
          NProgress.done()
          next()
        }
      } else if (childrenPath.some((item) => to.path.includes(item))) {
        next()
      } else {
        next({ name: '404' })
      }
    }
  } else {
    // بدونيملكانتقل إلى واجهة تسجيل الدخول عند تسجيل الدخول
    // المسار الكامل الذي يحتاج إلى القفز بعد أن ينجح تسجيل الدخول
    // https://github.com/d2-projects/d2-admin/issues/138
    if (whiteList.indexOf(to.path) !== -1) {
      // يخرجحرةالقائمة البيضاء，يدخل
      next()
    } else {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      NProgress.done()
    }
  }
})

router.afterEach(to => {
  // شريط التقدم
  NProgress.done()
  // التحكم متعدد الصفحات افتح الصفحة الجديدة
  store.dispatch('d2admin/page/open', to)
  // تغيير العنوان
  util.title(to.meta.title)
})

export default router
