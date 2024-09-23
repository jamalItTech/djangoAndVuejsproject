export default {
  // تكوين نوع الحقل，بعد التسجيلcrud.jsيستخدم
  'table-list-selector': {
    // تكوين مكون النموذج
    form: { component: { name: 'table-list-selector-input', props: { color: 'danger' } } },
    // تكوين مكون الخط
    component: { name: 'values-format', props: {} },
    // عرض في الوسط
    align: 'center'
    // يمكنك أيضًا كتابة المزيد من التكوين الافتراضي
  }
}
