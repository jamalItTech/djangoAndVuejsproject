export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      tableType: 'vxe-table',
      rowKey: true, // يجب تعيين，true or false
      rowId: 'id',
      height: '100%', // ارتفاع100%, يستخدمtoolbarيجب تعيين
      highlightCurrentRow: false

    },
    rowHandle: {
      fixed: 'right',
      view: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Retrieve')
        }
      },
      width: 70,
      edit: {
        thin: true,
        text: '',
        show: false,
        disabled () {
          return !vm.hasPermissions('Update')
        }
      },
      remove: {
        thin: true,
        text: 'يمسح',
        show: false,
        disabled () {
          return !vm.hasPermissions('Delete')
        }
      }
    },
    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      disabled: true,
      defaultSpan: 12 // النموذج الافتراضي span
    },
    indexRow: { // أو تمر مباشرةtrue,لا تعرضtitle，غير شعبية
      title: 'رقم سري',
      align: 'center',
      width: 70
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
          show: false,
          component: {
            placeholder: 'الرجاء الدخولالكلمة الرئيسية'
          }
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
        title: 'طلب وحدة',
        key: 'request_modular',
        search: {
          disabled: false
        },
        width: 140,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: 'الرجاء الدخولطلب وحدة'
          }
        }
      },
      {
        title: 'طلب عنوان',
        key: 'request_path',
        search: {
          disabled: false
        },
        width: 220,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: 'الرجاء الدخولطلب عنوان'
          }
        }
      },
      {
        title: 'طلب المعلمات',
        key: 'request_body',
        search: {
          disabled: true
        },
        disabled: true,
        type: 'textarea',
        form: {
          disabled: true,
          component: {
            props: {
              type: 'textarea'
            },
            autosize: {
              minRows: 2, maxRows: 8
            },
            placeholder: 'الرجاء الدخولالكلمة الرئيسية'
          }
        }
      },
      {
        title: 'طريقة الطلب',
        key: 'request_method',
        width: 80,
        type: 'input',
        search: {
          disabled: false
        },
        form: {
          disabled: true,
          component: {
            placeholder: 'الرجاء الدخولطريقة الطلب'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      },
      {
        title: 'وصف التشغيل',
        key: 'request_msg',
        disabled: true,
        form: {
          component: {
            span: 12
          }
        }
      },
      {
        title: 'IPعنوان',
        key: 'request_ip',
        search: {
          disabled: false
        },
        width: 130,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: 'الرجاء الدخولIPعنوان'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      },
      {
        title: 'متصفح الكرف',
        key: 'request_browser',
        width: 180,
        type: 'input',
        form: {
          disabled: true
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      },
      {
        title: 'رمز الاستجابة',
        key: 'response_code',
        search: {
          disabled: true
        },
        width: 80,
        type: 'input',
        form: {
          disabled: true
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      },
      {
        title: 'نظام التشغيل',
        key: 'request_os',
        disabled: true,
        search: {
          disabled: true
        },
        type: 'input',
        form: {
          disabled: true
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      },
      {
        title: 'إرجاع المعلومات',
        key: 'json_result',
        search: {
          disabled: true
        },
        minWidth: 240,
        type: 'input',
        form: {
          disabled: true
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'المشغل',
        width: 100,
        key: 'creator_name',
        form: {
          disabled: true
        }
      },
      {
        title: 'تحديث الوقت',
        key: 'update_datetime',
        width: 160,
        show: false,
        type: 'datetime',
        form: {
          disabled: true
        }
      },
      {
        fixed: 'right',
        title: 'وقت التشغيل',
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
