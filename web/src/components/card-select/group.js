export default {
  // تكوين نوع الحقل，بعد التسجيلcrud.jsيستخدم
  'card-select': {
    // تكوين مكون النموذج
    form: { component: { name: 'card-select-form', props: { color: 'danger' } } },
    // تكوين مكون الخط
    component: { name: 'values-format', props: {} },
    // عرض في الوسط
    align: 'center'
    // يمكنك أيضًا كتابة المزيد من التكوين الافتراضي
  }
}
