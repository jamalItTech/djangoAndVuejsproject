/*
 * @إنشاء وقت الملف: 2021-06-01 22:41:21
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-07-04 00:54:41
 * يتصلQq:1638245306
 * @مقدمة الملف: مقدمة الإصدار
 */
import util from '@/libs/util.js'

export default {
  namespaced: true,
  mutations: {
    /**
     * @description عرض معلومات الإصدار
     * @param {Object} state state
     */
    versionShow () {
      util.log.capsule('D2Admin', `v${process.env.VUE_APP_VERSION}`)
      console.log('DVAdmin(Gitee)：https://gitee.com/liqianglog/django-vue-admin')
      console.log('عنوان العرض التوضيحي：https://demo.django-vue-admin.com')
      console.log('عنوان المجتمع：https://bbs.django-vue-admin.com')
      console.log('عنوان الوثيقة：https://www.django-vue-admin.com')
      console.log('التكوين الأماميعنوان الوثيقة：https://d2.pub/zh/doc/d2-crud-v2')
      console.log('من فضلك لا تخيلك star，شكرًا ~')
    }
  }
}
