import * as api from './api'
export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    pagination: false,
    options: {
      tableType: 'vxe-table',
      stripe: false,
      rowKey: true, // يجب تعيين，true or false
      rowId: 'id',
      height: '100%', // ارتفاع100%, يستخدمtoolbarيجب تعيين
      highlightCurrentRow: false,
      defaultExpandAll: true,
      resizable: true,
      treeConfig: {
        transform: true,
        rowField: 'id',
        parentField: 'parent',
        hasChild: 'hasChild',
        lazy: true,
        loadMethod: ({ row }) => {
          let query = JSON.parse(JSON.stringify(vm.getSearch().getForm()))
          query = Object.fromEntries(
            Object.entries(query).filter(([_, value]) => ![undefined, null, [], '[]', ''].includes(value))
          )
          query.parent = row.id
          // console.log(query)
          return api.GetList({ ...query }).then(ret => {
            return ret.data.data
          })
        },
        iconLoaded: 'el-icon-loading' // تجميلloadingرمز
      }
    },
    rowHandle: {
      fixed: 'right',
      width: 140,
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
      }
    },
    indexRow: {
      // أو تمر مباشرةtrue,لا تعرضtitle，غير شعبية
      title: 'رقم سري',
      align: 'center',
      width: 70
    },

    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      defaultSpan: 12 // النموذج الافتراضي span
    },
    columns: [
      {
        title: 'الكلمة الرئيسية',
        key: 'search',
        show: false,
        disabled: true,
        search: {
          disabled: true
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
        view: {
          // عرض تكوين منفصل لمكون مربع الحوار
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
        show: false,
        title: 'قسم متفوق',
        key: 'parent',
        type: 'tree-selector',
        minWidth: 200,
        dict: {
          isTree: true,
          label: 'name',
          value: 'id',
          cache: false,
          getData: (url, dict, { form, component }) => { // تكوين هذه المعلمة سيغطي الموقف العامgetRemoteDictFunc
            return api.DeptLazy().then(ret => { return ret })
          }
        },
        form: {
          helper: 'اترك قسمًا افتراضيًا قصيرًا للمؤسس',
          component: {
            span: 12,
            props: {
              multiple: false
            }
          }
        }
      },
      {
        title: 'اسم القسم',
        key: 'name',
        sortable: true,
        treeNode: true, // تعيين عمود شجرة
        minWidth: 180,
        search: {
          disabled: false,
          component: {
            props: {
              clearable: true
            }
          }
        },
        type: 'input',
        showOverflow: 'tooltip',
        form: {
          rules: [
            // قواعد التحقق من النموذج
            { required: true, message: 'اسم القسميتطلب عنصر' }
          ],
          component: {
            span: 12,
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولاسم القسم'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'شعار الإدارات',
        key: 'key',
        sortable: true,
        minWidth: 100,
        form: {
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
      },
      {
        title: 'الشخص المسؤول',
        key: 'owner',
        sortable: true,
        minWidth: 100,
        form: {
          component: {
            span: 12,
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولالشخص المسؤول'
          }
        }
      },
      {
        title: 'اتصل برقم الهاتف',
        key: 'phone',
        sortable: true,
        minWidth: 100,
        form: {
          component: {
            span: 12,
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولاتصل برقم الهاتف'
          }
        }
      },
      {
        title: 'بريد',
        key: 'email',
        sortable: true,
        minWidth: 100,
        form: {
          component: {
            span: 12,
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولبريد'
          },
          rules: [
            {
              type: 'email',
              message: 'الرجاء الدخول正确的بريدعنوان',
              trigger: ['blur', 'change']
            }
          ]
        }
      },
      {
        title: 'نوع',
        key: 'sort',
        sortable: true,
        width: 80,
        type: 'number',
        form: {
          value: 1,
          component: {
            span: 12,
            placeholder: 'يختاررقم سري'
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
        width: 90,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_status_bool')
        },
        form: {
          value: true,
          component: {
            span: 12,
            placeholder: 'يختارولاية'
          }
        }
      }
    ].concat(vm.commonEndColumns())
  }
}
