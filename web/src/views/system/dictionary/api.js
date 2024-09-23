import { request } from '@/api/service'
import XEUtils from 'xe-utils'
export const urlPrefix = '/api/system/dictionary/'

/**
 * قائمة الاستعلام
 */
export function GetList (query) {
  return request({
    url: urlPrefix,
    method: 'get',
    params: query
  }).then(res => {
    // قم بتحويل بيانات القائمة إلى بيانات الأشجار
    res.data.data = XEUtils.toArrayTree(res.data.data, { parentKey: 'parent' })
    return res
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
