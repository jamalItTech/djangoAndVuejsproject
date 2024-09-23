import axios from 'axios'
import Adapter from 'axios-mock-adapter'
import { get } from 'lodash'
import util from '@/libs/util'
import { dataNotFound, errorCreate, errorLog } from './tools'
import router from '@/router'
import qs from 'qs'

/**
 * @description إنشاء مثيل طلب
 */

export function getErrorMessage (msg) {
  if (typeof msg === 'string') {
    return msg
  }
  if (typeof msg === 'object') {
    if (msg.code === 'token_not_valid') {
      util.cookies.remove('token')
      util.cookies.remove('uuid')
      router.push({ path: '/login' })
      router.go(0)
      return 'مهلة تسجيل الدخول，الرجاء تسجيل الدخول مرة أخرى！'
    }
    if (msg.code === 'user_not_found') {
      util.cookies.remove('token')
      util.cookies.remove('uuid')
      router.push({ path: '/login' })
      router.go(0)
      return 'المستخدم غير صالح，الرجاء تسجيل الدخول مرة أخرى！'
    }
    return Object.values(msg)
  }
  if (Object.prototype.toString.call(msg).slice(8, -1) === 'Array') {
    return msg
  }
  return msg
}

function createService () {
  // إنشاء axios مثال
  const service = axios.create({
    baseURL: util.baseURL(),
    timeout: 20000,
    paramsSerializer: (params) => qs.stringify(params, { indices: false })
  })
  // طلب اعتراض
  service.interceptors.request.use(
    config => config,
    error => {
      // فشل في إرسال
      console.log(error)
      return Promise.reject(error)
    }
  )
  // اعتراض الاستجابة
  service.interceptors.response.use(
    async response => {
      // dataAxios نعم axios البيانات الخلفية data
      let dataAxios = response.data || null
      if (response.headers['content-disposition']) {
        dataAxios = response
      }
      // رمز الحالة هذانعمومرة أخرى
      const { code } = dataAxios
      // وفق code الحكم
      if (code === undefined) {
        // إذا لم يكن كذلك code لا يمثل هذانعمواجهة تطوير المشروع -التنمية على سبيل المثالنعم D2Admin اطلب أحدث إصدار
        return dataAxios
      } else {
        // يملك code تمثل هذانعمواجهة خلفية يمكن الحكم عليه
        switch (code) {
          case 2000:
            // [ مثال مثالي ] code === 2000 تمثل الممثليملكخطأ
            // TODO قد لا تزال بحاجةcodeوmsgالعلاج اللاحق，حتى أزل.dataإرجاع جميع النتائج
            // return dataAxios.data
            return dataAxios
          case 401:
            if (response.config.url === 'api/login/') {
              errorCreate(`${getErrorMessage(dataAxios.msg)}`)
              break
            }
            var res = await refreshTken()
            // قم بتعيين عدد الطلبات المهلة
            var config = response.config
            util.cookies.set('token', res.data.access)
            config.headers.Authorization = 'JWT ' + res.data.access
            config.__retryCount = config.__retryCount || 0
            if (config.__retryCount >= config.retry) {
              // إذا تجاوز عدد المراجعات3ثانياً ، صفحة تسجيل الدخول إلى القفز
              util.cookies.remove('token')
              util.cookies.remove('uuid')
              router.push({ path: '/login' })
              errorCreate('انتهت صلاحية الشهادة,الرجاء تسجيل الدخول مرة أخرى~')
              break
            }
            config.__retryCount += 1
            return service(config)
          case 404:
            dataNotFound(`${dataAxios.msg}`)
            break
          case 4000:
            // يمسحcookie
            errorCreate(`${getErrorMessage(dataAxios.msg)}`)
            break
          case 400:
            errorCreate(`${dataAxios.msg}`)
            break
          default:
            // لانعمغير صحيح code
            errorCreate(`${dataAxios.msg}: ${response.config.url}`)
            break
        }
      }
    },
    error => {
      const status = get(error, 'response.status')
      switch (status) {
        case 400:
          error.message = 'طلب الأخطاء'
          break
        case 401:
          util.cookies.remove('token')
          util.cookies.remove('uuid')
          util.cookies.remove('refresh')
          router.push({ path: '/login' })
          error.message = 'انتهت صلاحية الشهادة,الرجاء تسجيل الدخول مرة أخرى~'
          break
        case 403:
          error.message = 'تم الرفض'
          break
        case 404:
          error.message = `طلب خطأ العنوان: ${error.response.config.url}`
          break
        case 408:
          error.message = 'طلب مهلة'
          break
        case 500:
          error.message = 'خطأ في الخادم الداخلي'
          break
        case 501:
          error.message = 'لم تتحقق الخدمة'
          break
        case 502:
          error.message = 'خطأ التجار'
          break
        case 503:
          error.message = 'الخدمة غير متوفرة'
          break
        case 504:
          error.message = 'مهلة بوابة'
          break
        case 505:
          error.message = 'HTTPالإصدار غير مدعوم'
          break
        default:
          break
      }
      errorLog(error)
      return Promise.reject(error)
    }
  )
  return service
}

/**
 * @description إنشاء طريقة طلب
 * @param {Object} service axios مثال
 */
function createRequestFunction (service) {
  // يفحصنعمما إذا كان وضع المستأجر。يستبدل وضع المستأجر اسم المجال إلى اسم المجال منفذ إضافي
  return function (config) {
    const token = util.cookies.get('token')
    // متوافق مع القيمة المنطقية
    var params = get(config, 'params', {})
    for (const key of Object.keys(params)) {
      if (String(params[key]) === 'true') {
        params[key] = 1
      }
      if (String(params[key]) === 'false') {
        params[key] = 0
      }
    }
    const configDefault = {
      headers: {
        Authorization: 'JWT ' + token,
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      timeout: 60000,
      baseURL: util.baseURL(),
      data: {},
      params: params,
      retry: 3, // إعادة ترجمة رقم
      retryDelay: 1000 // إعادة ترجمة الفاصل الزمني
    }
    return service(Object.assign(configDefault, config))
  }
}

// تستخدم لطلبات الشبكة الحقيقيةمثالوطريقة الطلب
export const service = createService()
export const request = createRequestFunction(service)

// تستخدم لمحاكاة طلبات الشبكةمثالوطريقة الطلب
export const serviceForMock = createService()
export const requestForMock = createRequestFunction(serviceForMock)

// أداة محاكاة بيانات طلب الشبكة
export const mock = new Adapter(serviceForMock)

// ينعشtoken
const refreshTken = function () {
  const refresh = util.cookies.get('refresh')
  return request({
    url: 'token/refresh/',
    method: 'post',
    data: {
      refresh: refresh
    }
  })
}

/**
 * تنزيل الملف
 * @param url
 * @param params
 * @param method
 * @param filename
 */
export const downloadFile = function ({
  url,
  params,
  method,
  filename = 'تصدير الملف'
}) {
  request({
    url: url,
    method: method,
    params: params,
    responseType: 'blob'
    // headers: {Accept: 'application/vnd.openxmlformats-officedocument'}
  }).then(res => {
    const xlsxName = window.decodeURI(res.headers['content-disposition'].split('=')[1])
    const fileName = xlsxName || `${filename}.xlsx`
    if (res) {
      const blob = new Blob([res.data], { type: 'charset=utf-8' })
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // يطلقURL هدف0
      document.body.removeChild(elink)
    }
  })
}
