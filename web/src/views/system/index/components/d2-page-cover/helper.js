export default {
  crud: `  columns: [
    {
      title: 'تاريخ', //اسم الحقل
      key: 'date', //مجالkey
      type: 'date', //مجاليكتب，اضف إليه、يراجع、سيقوم الاستعلام تلقائيًا بإنشاء مكون النموذج المقابل
    },
    {
      title: 'ولاية',
      key: 'status',
      type: 'select', //مربع الاختيار，الافتراضي وحده
      dict: { url: '/dicts/OpenStatusEnum' }//قاموس البيانات عن بُعد
    },
    {
      title: 'منطقة',
      key: 'province',
      type: 'select', //مربع الاختيار
      form: { //تكوين مخصص مكون النموذج，هنامربع الاختيارلخيارات متعددة
        component: { //يدعمv-modelعنصر
          props: { filterable: true, multiple: true, clearable: true }
        }
      },
      dict: {
        data: [ //قاموس البيانات المحلي
          { value: 'sz', label: 'شنتشن' },
          { value: 'gz', label: 'قوانغتشو' },
          { value: 'wh', label: 'ووهان' },
          { value: 'sh', label: 'شنغهاي' }
        ]
      }
    }
  ]
  `
}
