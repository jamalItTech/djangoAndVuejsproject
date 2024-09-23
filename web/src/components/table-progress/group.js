export default {
  // تكوين نوع الحقل，بعد التسجيلcrud.jsيستخدم
  'table-progress': {
    // تكوين مكون النموذج
    form: { component: { name: 'form-input', props: { color: 'danger' } } },
    // تكوين مكون الخط
    component: { name: 'table-progress', props: {} },
    // عرض في الوسط
    align: 'center'
    // يمكنك أيضًا كتابة المزيد من التكوين الافتراضي
  }
}
