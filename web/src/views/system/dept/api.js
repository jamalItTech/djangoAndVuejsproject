import { request } from '@/api/service'
import XEUtils from 'xe-utils'
export const urlPrefix = '/api/system/dept/'
/**
 * قائمة الاستعلام
 */
export function GetList (query) {
  // query.limit = 999;
  return request({
    url: urlPrefix,
    method: 'get',
    params: query
  })
}

export function GetListAll (query) {
  return request({
    url: urlPrefix + 'all_dept/',
    method: 'get',
    params: query
  })
}

/**
 * يزيد
 */
export function createObj (obj) {
  return request({
    url: urlPrefix,
    method: 'post',
    data: obj
  })
}

/**
 * يراجع
 */
export function UpdateObj (obj) {
  return request({
    url: urlPrefix + obj.id + '/',
    method: 'put',
    data: obj
  })
}

/**
 * يمسح
 */
export function DelObj (id) {
  return request({
    url: urlPrefix + id + '/',
    method: 'delete',
    data: { id }
  })
}

/**
 * قسم التحميل كسول
 */
export function DeptLazy (query) {
  return request({
    url: '/api/system/dept_lazy_tree/',
    method: 'get',
    params: query
  }).then(res => {
    return XEUtils.toArrayTree(res.data, { parentKey: 'parent' })
  })
}
