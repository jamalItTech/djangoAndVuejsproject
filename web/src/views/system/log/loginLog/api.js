/*
 * @إنشاء وقت الملف: 2021-06-08 10:40:32
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-06-09 10:36:20
 * يتصلQq:1638245306
 * @مقدمة الملف: سجل التشغيل
 */
import { request } from '@/api/service'

export const urlPrefix = '/api/system/login_log/'

export function GetList (query) {
  return request({
    url: urlPrefix,
    method: 'get',
    params: query
  })
}
