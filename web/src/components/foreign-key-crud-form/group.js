export default {
  // تكوين نوع الحقل，بعد التسجيلcrud.jsيستخدم
  'foreign-key-crud-form': {
    // تكوين مكون الخط
    form: { component: { name: 'foreign-key-crud-form', props: { color: 'danger' } } },
    component: {
      name: 'values-popover',
      props: {
        elProps: {
          type: 'list',
          rowKey: 'name'
        }
      }
    },
    // عرض في الوسط
    align: 'center'
    // يمكنك أيضًا كتابة المزيد من التكوين الافتراضي
  }
}
