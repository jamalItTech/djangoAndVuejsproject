import layoutHeaderAside from '@/layout/header-aside'
import { checkPlugins } from '@/views/plugins/index.js'
// لأن الكثير من تحميل الصفحة سوف يسببwebpackالتحديث الساخن بطيء للغاية，وبالتالي فإن بيئة التطوير لا تستخدم التحميل كسول，فقط محملة بتكاسل في بيئة الإنتاج
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
const pluginImport = require('@/libs/util.import.plugin')
/**
 * عرض في الإطار الرئيسي
 */
const frameIn = [{
  path: '/',
  redirect: { name: 'index' },
  component: layoutHeaderAside,
  children: [
    // وحدة التحكم
    {
      path: 'index',
      name: 'index',
      meta: {
        auth: true
      },
      component: _import('dashboard/workbench/index')
    },
    {
      path: 'page1',
      name: 'page1',
      meta: {
        auth: true
      },
      component: _import('demo/page1/index')
    },
    {
      path: 'userInfo',
      name: 'userInfo',
      meta: {
        title: 'معلومات شخصية',
        auth: true
      },
      component: () => import('@/layout/header-aside/components/header-user/userinfo')
    },
    // dashboard طاولة العمل
    {
      path: 'workbench',
      name: 'workbench',
      meta: {
        title: 'طاولة العمل',
        auth: true
      },
      component: _import('dashboard/workbench')
    },
    // تحديث الصفحة يجب الاحتفاظ بها
    {
      path: 'refresh',
      name: 'refresh',
      hidden: true,
      component: _import('system/function/refresh')
    },
    // إعادة توجيه الصفحة يجب الاحتفاظ بها
    {
      path: 'redirect/:route*',
      name: 'redirect',
      hidden: true,
      component: _import('system/function/redirect')
    }
  ]
}]

/**
 * عرض خارج الإطار الرئيسي
 */
const frameOut = [
  // تسجيل الدخول
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]
/**
 * طرف ثالثتسجيل الدخول
 */
const oauth2PluginsType = checkPlugins('dvadmin-oauth2-web')
if (oauth2PluginsType) {
  frameOut.push({
    path: '/oauth2',
    name: 'login',
    component: oauth2PluginsType === 'local' ? _import('plugins/dvadmin-oauth2-web/src/login/index') : pluginImport('dvadmin-oauth2-web/src/login/index')
  })
}
/**
 * يتقدم الممارسون بطلب للتسجيل
 */
const tenantsPluginsType = checkPlugins('dvadmin-tenants-web')
if (tenantsPluginsType) {
  frameOut.push({
    path: '/register',
    name: 'tenantsRegister',
    component: tenantsPluginsType === 'local' ? _import('plugins/dvadmin-tenants-web/src/register/index') : pluginImport('dvadmin-tenants-web/src/register/index')
  })
}
/**
 * صفحة الخطأ
 */
const errorPage = [{
  path: '/404',
  name: '404',
  component: _import('system/error/404')
}]

// يتطلب التصدير قائمة العرض
export const frameInRoutes = frameIn
export const frameOutRoutes = frameOut

// التصدير بعد إعادة التنظيم
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
