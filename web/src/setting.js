export default {
  // مفتاح الاختصار
  // يدعممفتاح الاختصار على سبيل المثال ctrl+shift+s
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // تكوين الشريط الجانبي الافتراضي
  menu: {
    asideCollapse: false,
    asideTransition: true
  },
  // فشل الصفحة الافتراضية عند قراءة البيانات المتينة
  page: {
    opened: [
      {
        name: 'index',
        fullPath: '/index',
        meta: {
          title: 'وحدة التحكم',
          auth: false
        }
      }
    ]
  },
  // البحث عن القائمة
  search: {
    enable: true
  },
  // موضوع مسجل
  theme: {
    list: [
      {
        title: 'd2admin كلاسيكي',
        name: 'd2',
        preview: 'image/theme/d2/preview@2x.png'
      },
      {
        title: 'Chester',
        name: 'chester',
        preview: 'image/theme/chester/preview@2x.jpg'
      },
      {
        title: 'Element',
        name: 'element',
        preview: 'image/theme/element/preview@2x.jpg'
      },
      {
        title: 'البنفسجي',
        name: 'violet',
        preview: 'image/theme/violet/preview@2x.jpg'
      },
      {
        title: 'خط بسيط',
        name: 'line',
        backgroundImage: 'image/theme/line/bg.jpg',
        preview: 'image/theme/line/preview@2x.jpg'
      },
      {
        title: 'نيزك',
        name: 'star',
        backgroundImage: 'image/theme/star/bg.jpg',
        preview: 'image/theme/star/preview@2x.jpg'
      },
      {
        title: 'Tomorrow Night Blue (vsCode)',
        name: 'tomorrow-night-blue',
        preview: 'image/theme/tomorrow-night-blue/preview@2x.jpg'
      }
    ]
  },
  // ما إذا كنت تريد تشغيل سطح الصفحة لتبديل الرسوم المتحركة افتراضيًا
  transition: {
    active: true
  }
}
