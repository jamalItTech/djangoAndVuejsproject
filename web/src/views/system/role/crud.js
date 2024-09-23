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
      view: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Retrieve')
        }
      },
      width: 230,
      edit: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Update')
        }
      },
      remove: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Delete')
        }
      },
      custom: [{
        show (index, row) {
          return true
        },
        disabled () {
          return !vm.hasPermissions('Update')
        },
        text: 'إدارة السلطة',
        type: 'warning',
        size: 'small',
        emit: 'createPermission'
      }]

    },
    indexRow: { // أو تمر مباشرةtrue,لا تعرضtitle，غير شعبية
      title: 'رقم سري',
      align: 'center',
      width: 100
    },

    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      defaultSpan: 24, // النموذج الافتراضي span
      width: '35%'
    },
    columns: [{
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
          props: {
            clearable: true
          },
          placeholder: 'الرجاء الدخولالكلمة الرئيسية'
        }
      },
      view: { // عرض تكوين منفصل لمكون مربع الحوار
        disabled: true
      }
    },
    {
      title: 'ID',
      key: 'id',
      show: false,
      width: 90,
      form: {
        disabled: true
      }
    },

    {
      title: 'اسم الشخصية',
      key: 'name',
      sortable: true,
      minWidth: 120,
      search: {
        disabled: false,
        component: {
          props: {
            clearable: true
          }
        }
      },

      type: 'input',
      form: {
        rules: [ // قواعد التحقق من النموذج
          { required: true, message: 'اسم الشخصيةيتطلب عنصر' }
        ],
        component: {
          props: {
            clearable: true
          },
          placeholder: 'الرجاء الدخولاسم الشخصية'
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    },
    {
      title: 'أذونات',
      key: 'key',
      sortable: true,
      minWidth: 100,
      form: {
        rules: [ // قواعد التحقق من النموذج
          { required: true, message: 'أذوناتيتطلب عنصر' }
        ],
        component: {
          props: {
            clearable: true
          },
          placeholder: 'الرجاء إدخال شخصية المعرف'
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    }, {
      title: 'نوع',
      key: 'sort',
      sortable: true,
      width: 80,
      type: 'number',
      form: {
        value: 1,
        component: {
          placeholder: 'الرجاء الدخولنوع'
        }
      }
    },
    {
      title: 'سواء كان المسؤول',
      key: 'admin',
      sortable: true,
      type: 'radio',
      minWidth: 120,
      dict: {
        data: vm.dictionary('button_whether_bool')
      },
      form: {
        value: false,
        component: {
          placeholder: 'يختارسواء كان المسؤول',
          show (context) {
            return vm.info.is_superuser
          }
        }
      }
    },
    {
      title: 'ولاية',
      key: 'status',
      sortable: true,
      search: {
        disabled: false
      },
      type: 'radio',
      minWidth: 100,
      dict: {
        data: vm.dictionary('button_status_bool')
      },
      form: {
        value: true,
        component: {
          placeholder: 'يختارولاية'
        }
      },
      component: { props: { color: 'auto' } }
    }
    ].concat(vm.commonEndColumns())
  }
}
