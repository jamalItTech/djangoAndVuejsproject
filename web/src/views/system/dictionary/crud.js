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
      highlightCurrentRow: false,
      treeConfig: { // تكوين بيانات الشجرة
        children: 'children',
        hasChild: 'hasChildren',
        expandAll: true
      }
    },
    rowHandle: {
      width: 230,
      view: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Retrieve')
        }
      },
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
        text: ' تكوين القاموس',
        type: 'success',
        size: 'small',
        emit: 'dictionaryConfigure'
      }]
    },
    indexRow: { // أو تمر مباشرةtrue,لا تعرضtitle，غير شعبية
      title: 'رقم سري',
      align: 'center',
      width: 80
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
      disabled: true,
      width: 90,
      form: {
        disabled: true
      }
    },
    {
      title: 'اسم القاموس',
      key: 'label',
      minWidth: 100,
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
          { required: true, message: 'اسم القاموسيتطلب عنصر' }
        ],
        component: {
          props: {
            clearable: true
          },
          placeholder: 'الرجاء الدخولاسم القاموس'
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    },
    {
      title: 'رقم القاموس',
      key: 'value',
      minWidth: 100,
      search: {
        disabled: true,
        component: {
          props: {
            clearable: true
          }
        }
      },
      type: 'input',
      form: {
        rules: [ // قواعد التحقق من النموذج
          { required: true, message: 'رقم القاموسيتطلب عنصر' }
        ],
        component: {
          props: {
            clearable: true
          },
          placeholder: 'الرجاء الدخولرقم القاموس'
        },
        itemProps: {
          class: { yxtInput: true }
        },
        helper: {
          render (h) {
            return (< el-alert title="يستخدمطريقة：vm.dictionary('رقم القاموس')" type="warning"/>
            )
          }
        }
      }
    },

    {
      title: 'ولاية',
      key: 'status',
      width: 90,
      search: {
        disabled: false
      },
      type: 'radio',
      dict: {
        data: vm.dictionary('button_status_bool')
      },
      component: {
        props: {
          options: []
        }
      },
      form: {
        rules: [ // قواعد التحقق من النموذج
          { required: true, message: 'ولايةيتطلب عنصر' }
        ],
        value: true,
        component: {
          placeholder: 'يختارولاية'
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    },
    {
      title: 'نوع',
      key: 'sort',
      width: 90,
      type: 'number',
      form: {
        value: 1,
        component: {
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    }
    ].concat(vm.commonEndColumns({
      description: {
        showForm: false,
        showTable: false
      }
    }))
  }
}
