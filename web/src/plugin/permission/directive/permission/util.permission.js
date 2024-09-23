/*
 * @إنشاء وقت الملف: 2021-06-27 10:14:26
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-08-09 21:51:29
 * يتصلQq:1638245306
 * @مقدمة الملف: التحكم في الإذن
 */
import store from '@/store'
import router from '@/router'
export default {
  hasPermissions (value) {
    if (process.env.VUE_APP_PM_ENABLED) {
      const path = router.history.current.path// الطريق الحالي
      let needList = []
      if (typeof value === 'string') {
        needList.push(path + ':' + value)
      } else if (value && value instanceof Array && value.length > 0) {
        needList = needList.concat(path + ':' + value)
      }
      if (needList.length === 0) {
        throw new Error('need permissions! Like v-permission="usersphere:user:view" ')
      }
      const userPermissionList = store.getters['d2admin/permission/permissionList']
      return userPermissionList.some(permission => {
        return needList.includes(permission)
      })
    }
    return true
  }
}
