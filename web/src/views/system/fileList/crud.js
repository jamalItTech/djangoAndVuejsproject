export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      height: '100%'
    },
    rowHandle: {
      width: 110,
      view: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Retrieve')
        }
      },
      edit: false,
      remove: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Delete')
        }
      }
    },
    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      defaultSpan: 12 // النموذج الافتراضي span
    },
    indexRow: { // أو تمر مباشرةtrue,لا تعرضtitle，غير شعبية
      title: 'رقم سري',
      align: 'center',
      width: 100
    },
    columns: [
      {
        title: 'الكلمة الرئيسية',
        key: 'search',
        show: false,
        disabled: true,
        search: {
          disabled: false
        },
        form: {
          disabled: true,
          component: {
            placeholder: 'الرجاء الدخولالكلمة الرئيسية'
          }
        },
        view: {
          disabled: true
        }
      },
      {
        title: 'ID',
        key: 'id',
        width: 90,
        disabled: true,
        form: {
          disabled: true
        }
      },
      {
        title: 'اسم الملف',
        key: 'name',
        search: {
          disabled: false
        },
        width: 160,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولاسم الملف'
          }
        }
      },
      {
        title: 'عنوان الملف',
        key: 'url',
        type: 'file-uploader',
        search: {
          disabled: true
        },
        width: 220
      },
      {
        title: 'وثيقةMD5',
        key: 'md5sum',
        width: 200,
        search: {
          disabled: true
        },
        form: {
          disabled: false
        }
      },
      {
        title: 'ملاحظة',
        key: 'description',
        show: false,
        search: {
          disabled: true
        },
        type: 'textarea',
        form: {
          component: {
            placeholder: 'الرجاء إدخال المحتوى',
            showWordLimit: true,
            maxlength: '200',
            props: {
              type: 'textarea'
            }
          }
        }
      }, {
        title: 'الخالق',
        show: false,
        width: 100,
        key: 'modifier_name',
        form: {
          disabled: true
        }
      },
      {
        title: 'تحديث الوقت',
        key: 'update_datetime',
        width: 160,
        type: 'datetime',
        form: {
          disabled: true
        }
      },
      {
        title: 'وقت الخلق',
        key: 'create_datetime',
        width: 160,
        type: 'datetime',
        form: {
          disabled: true
        }
      }
    ]
  }
}
