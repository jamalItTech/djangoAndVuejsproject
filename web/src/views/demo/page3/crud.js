export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      height: '100%'
    },
    viewOptions: {
      componentType: 'row'
    },
    formOptions: {
      defaultSpan: 12 // النموذج الافتراضي span
    },
    columns: [
      {
        title: 'ID',
        key: 'id',
        width: 90,
        form: {
          disabled: true
        }
      },
      {
        title: 'وحيد',
        key: 'select1',
        sortable: true,
        search: {
          disabled: true
        },
        type: 'select',
        dict: {
          data: [{ value: '1', label: 'يفتح' }, { value: '0', label: 'إنهاء' }, { value: '2', label: 'قف' }]
        }
      },
      {
        title: 'خيار,محلي,الصباغة التلقائية',
        key: 'select2',
        sortable: true,
        width: 180,
        search: {
          disabled: false,
          title: 'خيار'
        },
        type: 'select',
        form: {
          title: 'خيارمحلي',
          component: {
            props: {
              filterable: true,
              multiple: true,
              clearable: true
            }
          }
        },
        dict: {
          data: [{ value: 'sz', label: 'شنتشن' }, { value: 'gz', label: 'قوانغتشو' }, { value: 'wh', label: 'ووهان' }, { value: 'sh', label: 'شنغهاي' }]
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }
    ]
  }
}
