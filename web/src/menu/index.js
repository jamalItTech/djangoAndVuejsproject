import { uniqueId } from 'lodash'
import { request } from '@/api/service'
import XEUtils from 'xe-utils'
import { frameInRoutes, frameOutRoutes } from '@/router/routes'
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
const pluginImport = require('@/libs/util.import.plugin')
/**
 * @description تكملة لبيانات القائمة path مجال
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu بيانات القائمة الأصلية
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([])

export const menuAside = supplementPath([])

// طلب بيانات القائمة,تستخدم لتحليل قائمة القائمة التوجيهية والقائمة الشريط الجانبي
export const getMenu = function () {
  return request({
    url: '/api/system/menu/web_router/',
    method: 'get',
    params: {}
  }).then((res) => {
    // ضبط التوجيه الديناميكي
    const menuData = res.data.data
    sessionStorage.setItem('menuData', JSON.stringify(menuData))
    return menuData
  })
}

/**
 * ما إذا كان التوجيه صالحًا
 */
export const checkRouter = function (menuData) {
  const result = []
  for (const item of menuData) {
    try {
      if (item.path !== '' && item.component) {
        (item.component && item.component.substr(0, 8) === 'plugins/') ? pluginImport(item.component.replace('plugins/', '')) : _import(item.component)
      }
      result.push(item)
    } catch (err) {
      console.log(`خطأ في القائمة，سوف يتسبب في عدم قدرة الصفحة على الوصول，يرجى التحقق مما إذا كان الملف موجودًا：${item.component}`)
    }
  }
  return result
}
/**
 * سيتم الحصول على بيانات القائمة الخلفية,التحليل هو الطريق الأمامي
 */
export const handleRouter = function (menuData) {
  const result = []
  for (const item of menuData) {
    if (item.path !== '' && item.component) {
      const obj = {
        path: item.path,
        name: item.component_name,
        component: (item.component && item.component.substr(0, 8) === 'plugins/') ? pluginImport(item.component.replace('plugins/', '')) : _import(item.component),
        meta: {
          title: item.name,
          auth: true,
          cache: item.cache,
          openInNewWindow: item.frame_out
        }
      }
      if (item.frame_out) {
        frameOutRoutes.push(obj)
      } else {
        result.push(obj)
      }
    } else {
      if (item.is_link === 0) {
        delete item.path
      }
    }
  }
  frameInRoutes[0].children = [...result]
  return { routes: frameInRoutes, frameOut: frameOutRoutes }
}

/**
 * معالجة القائمة الأمامية على الواجهة الأمامية
 */
export const handleAsideMenu = function (menuData) {
  // قم بتحويل بيانات القائمة إلى بيانات الأشجار
  const data = XEUtils.toArrayTree(menuData, {
    parentKey: 'parent',
    strict: true
  })
  const menu = [
    { path: '/index', title: 'وحدة التحكم', icon: 'home' },
    ...data
  ]
  return supplementPath(menu)
}
