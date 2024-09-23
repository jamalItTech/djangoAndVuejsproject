/*
 * @إنشاء وقت الملف: 2021-06-01 22:41:21
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-07-29 19:23:33
 * يتصلQq:1638245306
 * @مقدمة الملف: واجهة إدارة القائمة
 */
import { request } from '@/api/service'

export const urlPrefix = '/api/system/menu/'

/**
 * قائمة الاستعلام
 */
export function GetList (query) {
  return request({
    url: urlPrefix,
    method: 'get',
    params: { ...query }
  }).then(res => {
    // قم بتحويل بيانات القائمة إلى بيانات الأشجار
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
