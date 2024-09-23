import { request } from '@/api/service'

export const crudOptions = (vm) => {
  // util.filterParams(vm, ['dept_name', 'role_info{name}', 'dept_name_all'])
  return {
    pageOptions: {
      compact: true
    },
    options: {
      height: '100%',
      // tableType: 'vxe-table',
      // rowKey: true,
      rowId: 'id'
    },
    selectionRow: {
      align: 'center',
      width: 46
    },
    rowHandle: {
      width: 240,
      fixed: 'right',
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
      custom: [
        {
          thin: true,
          text: 'إعادة تعيين كلمة المرور',
          size: 'small',
          type: 'warning',
          icon: 'el-icon-refresh-left',
          show () {
            return vm.hasPermissions('ResetPassword')
          },
          emit: 'resetPassword'
        }
      ]
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
      width: 60
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
        disabled: true,
        form: {
          disabled: true
        }
      },
      {
        title: 'اسم القسم',
        key: 'dept__name',
        treeNode: true, // تعيين عمود شجرة
        search: {
          disabled: false,
          component: {
            props: {
              clearable: true
            }
          }
        },
        show: false,
        form: {
          disabled: true
        }
      },
      {
        title: 'حساب',
        key: 'username',
        search: {
          disabled: false
        },
        minWidth: 100,
        type: 'input',
        form: {
          rules: [ // قواعد التحقق من النموذج
            {
              required: true,
              message: 'حسابيتطلب عنصر'
            }
          ],
          component: {
            placeholder: 'الرجاء الدخولحساب'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'كلمة المرور',
        key: 'password',
        minWidth: 90,
        type: 'input',
        form: {
          rules: [ // قواعد التحقق من النموذج
            {
              required: true,
              message: 'كلمة المروريتطلب عنصر'
            }
          ],
          component: {
            span: 12,
            showPassword: true,
            placeholder: 'الرجاء الدخولكلمة المرور'
          },
          value: vm.systemConfig('base.default_password'),
          editDisabled: true,
          itemProps: {
            class: { yxtInput: true }
          }
        },
        disabled: true,
        valueResolve (row, key) {
          if (row.password) {
            row.password = vm.$md5(row.password)
          }
        }
      },
      {
        title: 'اسم',
        key: 'name',
        sortable: 'custom',
        minWidth: 90,
        search: {
          disabled: false
        },
        type: 'input',
        form: {
          rules: [ // قواعد التحقق من النموذج
            {
              required: true,
              message: 'اسميتطلب عنصر'
            }
          ],
          component: {
            span: 12,
            placeholder: 'الرجاء الدخولاسم'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'قسم',
        key: 'dept',
        search: {
          disabled: false
        },
        minWidth: 140,
        type: 'tree-selector',
        dict: {
          cache: true,
          isTree: true,
          url: '/api/system/dept/all_dept/',
          value: 'id', // قاموس البياناتvalueاسم السمة الحقل
          label: 'name' // قاموس البياناتlabelاسم السمة الحقل
        },
        form: {
          rules: [ // قواعد التحقق من النموذج
            {
              required: true,
              message: 'يتطلب عنصر'
            }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            span: 12,
            pagination: true,
            props: { multiple: false }
          }
        },
        component: {
          name: 'foreignKey',
          valueBinding: 'dept_name'
        }
      },
      {
        title: 'دور',
        key: 'role',
        search: {
          disabled: true
        },
        minWidth: 130,
        type: 'table-selector',
        dict: {
          cache: false,
          url: '/api/system/role/',
          value: 'id', // قاموس البياناتvalueاسم السمة الحقل
          label: 'name', // قاموس البياناتlabelاسم السمة الحقل
          getData: (url, dict, {
            form,
            component
          }) => {
            return request({
              url: url,
              params: {
                page: 1,
                limit: 10
              }
            }).then(ret => {
              component._elProps.page = ret.data.page
              component._elProps.limit = ret.data.limit
              component._elProps.total = ret.data.total
              return ret.data.data
            })
          }
        },
        form: {
          rules: [ // قواعد التحقق من النموذج
            {
              required: true,
              message: 'يتطلب عنصر'
            }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            span: 12,
            pagination: true,
            props: { multiple: true },
            elProps: {
              columns: [
                {
                  field: 'name',
                  title: 'دوراسم'
                },
                {
                  field: 'key',
                  title: 'أذونات'
                }
              ]
            }
          }
        },
        component: {
          name: 'manyToMany',
          valueBinding: 'role_info',
          children: 'name'
        }
      },
      {
        title: 'رقم التليفون',
        key: 'mobile',
        search: {
          disabled: false
        },
        minWidth: 110,
        type: 'input',
        form: {
          rules: [
            {
              max: 20,
              message: 'الرجاء الدخول正确的رقم التليفون',
              trigger: 'blur'
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: 'الرجاء الدخول正确的رقم التليفون'
            }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            placeholder: 'الرجاء الدخولرقم التليفون'
          }
        }
      }, {
        title: 'بريد',
        key: 'email',
        minWidth: 180,
        form: {
          rules: [
            {
              type: 'email',
              message: 'الرجاء الدخول正确的بريدعنوان',
              trigger: ['blur', 'change']
            }
          ],
          component: {
            placeholder: 'الرجاء الدخولبريد'
          }
        }
      },
      {
        title: 'جنس',
        key: 'gender',
        type: 'radio',
        width: 70,
        dict: {
          data: vm.dictionary('gender')
        },
        form: {
          value: 1,
          component: {
            span: 12
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'نوع المستخدم',
        key: 'user_type',
        search: {
          disabled: false
        },
        width: 145,
        type: 'select',
        dict: {
          data: vm.dictionary('user_type')
        },
        form: {
          show: false,
          value: 0,
          component: {
            span: 12
          }
        }
      }, {
        title: 'ولاية',
        key: 'is_active',
        search: {
          disabled: false
        },
        width: 70,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_status_bool')
        },
        form: {
          value: true,
          component: {
            span: 12
          }
        }
      },
      {
        title: 'الصورة الرمزية',
        key: 'avatar',
        type: 'avatar-cropper',
        width: 60,
        align: 'left',
        form: {
          component: {
            props: {
              elProps: { // وel-uploader إعدادات
                multiple: false,
                limit: 1 // حد5ملف فردي
              },
              sizeLimit: 500 * 1024 // لا يمكن أن تتجاوزحد
            },
            span: 24
          },
          helper: 'حد文件大小لا يمكن أن تتجاوز500k'
        }
      }
    ].concat(vm.commonEndColumns({
      create_datetime: { showTable: false },
      update_datetime: { showTable: false }
    }))
  }
}
