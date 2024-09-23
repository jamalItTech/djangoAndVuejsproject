/*
 * @إنشاء وقت الملف: 2021-06-01 22:41:19
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-08-01 02:35:45
 * يتصلQq:1638245306
 * @مقدمة الملف:
 */
import { Message } from 'element-ui'
import store from '@/store'
import util from '@/libs/util'

/**
 * @description تحليل آمن json خيط
 * @param {String} jsonString تدرب json خيط
 * @param {String} defaultValue القيمة الافتراضية
 */
export function parse (jsonString = '{}', defaultValue = {}) {
  let result = defaultValue
  try {
    result = JSON.parse(jsonString)
  } catch (error) {
    console.log(error)
  }
  return result
}

/**
 * @description طلب واجهة العودة
 * @param {Any} data قيمة الإرجاع
 * @param {String} msg معلومات الحالة
 * @param {Number} code رمز الحالة
 */
export function response (data = {}, msg = '', code = 0) {
  return [
    200,
    { code, msg, data }
  ]
}

/**
 * @description طلب واجهة العودة العودة بشكل صحيح
 * @param {Any} data قيمة الإرجاع
 * @param {String} msg معلومات الحالة
 */
export function responseSuccess (data = {}, msg = 'نجاح') {
  return response(data, msg)
}

/**
 * @description طلب واجهة العودة عودة الخطأ
 * @param {Any} data قيمة الإرجاع
 * @param {String} msg معلومات الحالة
 * @param {Number} code رمز الحالة
 */
export function responseError (data = {}, msg = 'طلب الفشل', code = 500) {
  return response(data, msg, code)
}

/**
 * @description خطأ وعرض الخطأ
 * @param {Error} error خطأ
 */
export function errorLog (error) {
  // أضف إلى سجل
  store.dispatch('d2admin/log/push', {
    message: 'طلب البيانات غير طبيعي',
    type: 'danger',
    meta: {
      error
    }
  })
  // اطبع إلى وحدة التحكم
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  // عرض موجه
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}

/**
 * @description إنشاء خطأ
 * @param {String} msg رسالة الخطأ
 */
export function errorCreate (msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}

/**
 * @description بيانات404موجه الرسالة
 * @param {String} msg رسالة الخطأ
 */
export function dataNotFound (msg) {
  // عرض موجه
  Message({
    message: msg,
    type: 'info',
    duration: 5 * 1000
  })
}

/**
 * @description بياناتبسألنجاح
 * @param {String} msg نجاحمعلومة
 */
export function successMsg (msg) {
  Message({
    message: msg,
    type: 'success',
    duration: 5 * 1000
  })
}
