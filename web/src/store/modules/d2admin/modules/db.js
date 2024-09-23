import router from '@/router'
import { cloneDeep } from 'lodash'
import { database as getDatabase, dbGet, dbSet } from '@/libs/util.db'

export default {
  namespaced: true,
  actions: {
    /**
     * @description تخزين البيانات إلى الموقع المحدد | المسار غير موجود وسيتم تهيئته تلقائيًا
     * @description التأثير مشابه للقيمة dbName.path = value
     * @param {Object} context
     * @param {Object} payload dbName {String} اسم قاعدة البيانات
     * @param {Object} payload path {String} مسار التخزين
     * @param {Object} payload value {*} القيمة التي يجب تخزينها
     * @param {Object} payload user {Boolean} سواء لتمييز المستخدم
     */
    set (context, {
      dbName = 'database',
      path = '',
      value = '',
      user = false
    }) {
      dbSet({ dbName, path, value, user })
    },
    /**
     * @description الحصول على البيانات
     * @description التأثير مشابه للقيمة dbName.path || defaultValue
     * @param {Object} context
     * @param {Object} payload dbName {String} اسم قاعدة البيانات
     * @param {Object} payload path {String} مسار التخزين
     * @param {Object} payload defaultValue {*} فشلت القيمة الافتراضية للقيمة
     * @param {Object} payload user {Boolean} سواء لتمييز المستخدم
     */
    get (context, {
      dbName = 'database',
      path = '',
      defaultValue = '',
      user = false
    }) {
      return dbGet({ dbName, path, defaultValue, user })
    },
    /**
     * @description احصل على كائن قاعدة بيانات التخزين
     * @param {Object} context
     * @param {Object} payload user {Boolean} سواء لتمييز المستخدم
     */
    database (context, {
      user = false
    } = {}) {
      return getDatabase({
        user,
        defaultValue: {}
      })
    },
    /**
     * @description امسح كائن قاعدة بيانات التخزين
     * @param {Object} context
     * @param {Object} payload user {Boolean} سواء لتمييز المستخدم
     */
    databaseClear (context, {
      user = false
    } = {}) {
      return getDatabase({
        user,
        validator: () => false,
        defaultValue: {}
      })
    },
    /**
     * @description احصل على كائن قاعدة بيانات التخزين [ تمييز الصفحة ]
     * @param {Object} context
     * @param {Object} payload basis {String} أساس الصفحة المتميزة [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} سواء لتمييز المستخدم
     */
    databasePage (context, {
      basis = 'fullPath',
      user = false
    } = {}) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}`,
        user,
        defaultValue: {}
      })
    },
    /**
     * @description امسح كائن قاعدة بيانات التخزين [ تمييز الصفحة ]
     * @param {Object} context
     * @param {Object} payload basis {String} أساس الصفحة المتميزة [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} سواء لتمييز المستخدم
     */
    databasePageClear (context, {
      basis = 'fullPath',
      user = false
    } = {}) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}`,
        user,
        validator: () => false,
        defaultValue: {}
      })
    },
    /**
     * @description استخدم البيانات الحالية للصفحة بسرعة ( $data ) متينة
     * @param {Object} context
     * @param {Object} payload instance {Object} vue مثال
     * @param {Object} payload basis {String} أساس الصفحة المتميزة [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} سواء لتمييز المستخدم
     */
    pageSet (context, {
      instance,
      basis = 'fullPath',
      user = false
    }) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}.$data`,
        user,
        validator: () => false,
        defaultValue: cloneDeep(instance.$data)
      })
    },
    /**
     * @description احصل بسرعة على الصفحة بسرعةمتينةبيانات
     * @param {Object} context
     * @param {Object} payload instance {Object} vue مثال
     * @param {Object} payload basis {String} أساس الصفحة المتميزة [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} سواء لتمييز المستخدم
     */
    pageGet (context, {
      instance,
      basis = 'fullPath',
      user = false
    }) {
      return dbGet({
        path: `$page.${router.app.$route[basis]}.$data`,
        user,
        defaultValue: cloneDeep(instance.$data)
      })
    },
    /**
     * @description واضحة لقطة صفحة
     * @param {Object} context
     * @param {Object} payload basis {String} أساس الصفحة المتميزة [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} سواء لتمييز المستخدم
     */
    pageClear (context, {
      basis = 'fullPath',
      user = false
    }) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}.$data`,
        user,
        validator: () => false,
        defaultValue: {}
      })
    }
  }
}
