import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import util from '@/libs/util'
import { cloneDeep } from 'lodash'

const adapter = new LocalStorage(`d2admin-${process.env.VUE_APP_VERSION}`)
const db = low(adapter)

db
  .defaults({
    sys: {},
    database: {}
  })
  .write()

export default db

/**
 * @description تحقق مما إذا كان المسار موجودًا إذا لم تكن موجودًا ، قم بتهيئة
 * @param {Object} payload dbName {String} اسم قاعدة البيانات
 * @param {Object} payload path {String} طريق
 * @param {Object} payload user {Boolean} التمييز بين المستخدمين
 * @param {Object} payload validator {Function} خطاف التحقق من البيانات يعود true التعبير عن تمريرة التحقق
 * @param {Object} payload defaultValue {*} تهيئة الاعتراف الصامت
 * @returns {String} يمكن استخدامه مباشرةطريق
 */
export function pathInit ({
  dbName = 'database',
  path = '',
  user = true,
  validator = () => true,
  defaultValue = ''
}) {
  const uuid = util.cookies.get('uuid') || 'ghost-uuid'
  const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`
  const value = db.get(currentPath).value()
  if (!(value !== undefined && validator(value))) {
    db
      .set(currentPath, defaultValue)
      .write()
  }
  return currentPath
}

/**
 * @description تخزين البيانات إلى الموقع المحدد | طريقإذا لم يكن هناك وجود ، فسيتم تهيئة تلقائيًا
 * @description التأثير مشابه للقيمة dbName.path = value
 * @param {Object} payload dbName {String} اسم قاعدة البيانات
 * @param {Object} payload path {String} تخزينطريق
 * @param {Object} payload value {*} القيمة التي يجب تخزينها
 * @param {Object} payload user {Boolean} سواءالتمييز بين المستخدمين
 */
export function dbSet ({
  dbName = 'database',
  path = '',
  value = '',
  user = false
}) {
  db.set(pathInit({
    dbName,
    path,
    user
  }), value).write()
}

/**
 * @description الحصول على البيانات
 * @description التأثير مشابه للقيمة dbName.path || defaultValue
 * @param {Object} payload dbName {String} اسم قاعدة البيانات
 * @param {Object} payload path {String} تخزينطريق
 * @param {Object} payload defaultValue {*} فشلت القيمة الافتراضية للقيمة
 * @param {Object} payload user {Boolean} سواءالتمييز بين المستخدمين
 */
export function dbGet ({
  dbName = 'database',
  path = '',
  defaultValue = '',
  user = false
}) {
  return cloneDeep(db.get(pathInit({
    dbName,
    path,
    user,
    defaultValue
  })).value())
}

/**
 * @description احصل على كائن قاعدة بيانات التخزين
 * @param {Object} payload user {Boolean} سواءالتمييز بين المستخدمين
 */
export function database ({
  dbName = 'database',
  path = '',
  user = false,
  validator = () => true,
  defaultValue = ''
} = {}) {
  return db.get(pathInit({
    dbName, path, user, validator, defaultValue
  }))
}
