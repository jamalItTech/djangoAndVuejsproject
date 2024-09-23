export default {
  methods: {
    onChangeLocale (command) {
      this.$i18n.locale = command
      let message = `اللغة الحالية：${this.$t('_name')} [ ${this.$i18n.locale} ]`
      if (process.env.VUE_APP_BUILD_MODE === 'PREVIEW') {
        message = [
          `اللغة الحالية：${this.$t('_name')} [ ${this.$i18n.locale} ]`,
          'توفير وظيفة التبديل فقط，لا توجد بيانات لغة محددة ',
          'مرجع الوثيقة：<a class="el-link el-link--primary is-underline" target="_blank" href="https://d2.pub/zh/doc/d2-admin/locales">《تدويل | D2Admin》</a>'
        ].join('<br/>')
      }
      this.$notify({
        title: 'تغيير اللغة',
        dangerouslyUseHTMLString: true,
        message
      })
    }
  }
}
