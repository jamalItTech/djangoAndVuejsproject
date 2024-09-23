import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import dayjs from 'dayjs'
import filterParams from './util.params'
const util = {
  cookies,
  db,
  log,
  filterParams
}

/**
 * @description تحديث العنوان
 * @param {String} titleText عنوان
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description افتح صفحة جديدة
 * @param {String} url عنوان
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}
/**
 * @description تحقق مما إذا كان وضع المستأجر。يستبدل وضع المستأجر اسم المجال إلى اسم المجال منفذ إضافي
 */
util.baseURL = function () {
  var baseURL = process.env.VUE_APP_API
  var param = baseURL.split('/')[3] || ''
  if (window.pluginsAll && window.pluginsAll.indexOf('dvadmin-tenants-web') !== -1 && (!param || baseURL.startsWith('/'))) {
    // 1.باقة127.0.0.1 استبدل نفس الواجهة الأماميةاسم المجال
    // 2.باقة ip عنواناستبدل نفس الواجهة الأماميةاسم المجال
    // 3.باقة /api 或其他类似的استبدل نفس الواجهة الأماميةاسم المجال
    // document.domain
    var host = baseURL.split('/')[2]
    if (host) {
      var prot = baseURL.split(':')[2] || 80
      if (prot === 80 || prot === 443) {
        host = document.domain
      } else {
        host = document.domain + ':' + prot
      }
      baseURL = baseURL.split('/')[0] + '//' + baseURL.split('/')[1] + host + '/' + param
    } else {
      baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' : '') + location.port + baseURL
    }
  }
  if (!baseURL.endsWith('/')) {
    baseURL += '/'
  }
  return baseURL
}

util.baseFileURL = function () {
  if (process.env.VUE_APP_FILE_ENGINE && (process.env.VUE_APP_FILE_ENGINE === 'oss' || process.env.VUE_APP_FILE_ENGINE === 'cos')) {
    return ''
  }
  return util.baseURL()
}
util.wsBaseURL = function () {
  var baseURL = process.env.VUE_APP_API
  var param = baseURL.split('/')[3] || ''
  if (window.pluginsAll && window.pluginsAll.indexOf('dvadmin-tenants-web') !== -1 && (!param || baseURL.startsWith('/'))) {
    // 1.باقة127.0.0.1 استبدل نفس الواجهة الأماميةاسم المجال
    // 2.باقة ip عنواناستبدل نفس الواجهة الأماميةاسم المجال
    // 3.باقة /api 或其他类似的استبدل نفس الواجهة الأماميةاسم المجال
    // document.domain
    var host = baseURL.split('/')[2]
    if (host) {
      var prot = baseURL.split(':')[2] || 80
      if (prot === 80 || prot === 443) {
        host = document.domain
      } else {
        host = document.domain + ':' + prot
      }
      baseURL = baseURL.split('/')[0] + '//' + baseURL.split('/')[1] + host + '/' + param
    } else {
      baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' : '') + location.port + baseURL
    }
  } else if (param !== '' || baseURL.startsWith('/')) {
    baseURL = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.hostname + (location.port ? ':' : '') + location.port + baseURL
  }
  if (!baseURL.endsWith('/')) {
    baseURL += '/'
  }
  if (baseURL.startsWith('http')) { // https سيتم استبداله أيضًا بالتخلف wss
    baseURL = baseURL.replace('http', 'ws')
  }
  return baseURL
}
/**
 * توليد تلقائيID
 */
util.autoCreateCode = function () {
  return dayjs().format('YYYYMMDDHHmmssms') + Math.round(Math.random() * 80 + 20)
}
/**
 * توليد تلقائيقصير ID
 */
util.autoShortCreateCode = function () {
  var Num = ''
  for (var i = 0; i < 4; i++) {
    Num += Math.floor(Math.random() * 10)
  }
  return dayjs().format('YYMMDD') + Num
}

/**
 * سلسلة عشوائية الإنتاج
 */
util.randomString = function (e) {
  e = e || 32
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var a = t.length
  var n = ''
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
  return n
}

util.randomColor = function () {
  const color = [
    '#50A8F4FF',
    '#FD6165FF',
    '#E679D8FF',
    '#F9AB5BFF'
  ]
  const ran = Math.floor(Math.random() * color.length)
  return color[ran]
}

util.randomBackground = function () {
  const background = [
    'linear-gradient(150deg, #accaff 0%, #3b88ec 100%)',
    'linear-gradient(150deg, #c5f8e6 0%, #10a465 100%)',
    'linear-gradient(150deg, #e8d6ff 0%, #9f55ff 100%)',
    'linear-gradient(150deg, #fdda45 0%, #fe6b62 100%)',
    'linear-gradient(150deg, #cefbc8 0%, #00aec5 100%)',
    'linear-gradient(150deg, #c5f8e6 0%, #10a465 100%)'
  ]
  const ran = Math.floor(Math.random() * background.length)
  return background[ran]
}

util.ArrayToTree = function (rootList, parentValue, parentName, list) {
  for (const item of rootList) {
    if (item.parent === parentValue) {
      if (parentName) {
        item.name = parentName + '/' + item.name
      }
      list.push(item)
    }
  }

  for (const i of list) {
    // إذا كان هناك عنصر الطفلchildrenمجرد عودة，لا توجد وتوليد واحدةchildren
    if (i.children) {
      util.ArrayToTree(rootList, i.id, i.name, i.children)
    } else {
      i.children = []
      util.ArrayToTree(rootList, i.id, i.name, i.children)
    }

    if (i.children.length === 0) {
      delete i.children
    }
  }
  return list
}
// حجم البايت التنسيق
util.formatBytes = function (bytes, decimals = 2) {
  if (isNaN(bytes)) {
    return bytes
  }

  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default util
