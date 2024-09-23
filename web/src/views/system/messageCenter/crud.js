import { request } from '@/api/service'

export const crudOptions = (vm) => {
  return {
    indexRow: { // أو تمر مباشرةtrue,لا تعرضtitle，غير شعبية
      width: 60,
      title: 'رقم سري',
      align: 'center'
    },
    options: {
      tableType: 'vxe-table',
      rowKey: true, // يجب تعيين，true or false
      height: '100%' // ارتفاع100%, يستخدمtoolbarيجب تعيين
    },
    rowHandle: {
      width: 160,
      fixed: 'right',
      view: false,
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
        text: '',
        show () {
          return vm.tabActivted !== 'receive'
        },
        disabled () {
          return !vm.hasPermissions('Delete')
        }
      },
      custom: [
        {
          thin: true,
          text: null,
          icon: 'el-icon-view',
          size: 'small',
          disabled () {
            return !vm.hasPermissions('Retrieve')
          },
          order: 1,
          emit: 'onView'
        }
      ]
    },
    columns: [
      {
        title: 'id',
        key: 'id',
        width: 100,
        form: { disabled: true }
      },
      {
        title: 'عنوان',
        key: 'title',
        search: {
          disabled: false
        },
        width: 200,
        form: {
          rules: [ // قواعد التحقق من النموذج
            {
              required: true,
              message: 'يتطلب عنصر'
            }
          ],
          component: { span: 24, placeholder: 'الرجاء الدخولعنوان' }
        }
      },
      {
        title: 'ما إذا كانت قد قرأت',
        key: 'is_read',
        type: 'select',
        width: 100,
        show () {
          return vm.tabActivted === 'receive'
        },
        dict: {
          data: [
            { label: 'يقرأ', value: true, color: 'success' },
            { label: 'غير معقول', value: false, color: 'danger' }
          ]
        },
        form: {
          disabled: true
        }
      },
      {
        title: 'نوع الهدف',
        key: 'target_type',
        type: 'radio',
        width: 120,
        show () {
          return vm.tabActivted === 'send'
        },
        dict: { data: [{ value: 0, label: 'مستخدم' }, { value: 1, label: 'دور' }, { value: 2, label: 'الإدارات' }, { value: 3, label: 'إعلان إشعار' }] },
        form: {
          component: {
            span: 24,
            props: {
              type: 'el-radio-button'
            }
          },
          rules: [
            {
              required: true,
              message: 'الخيار المطلوب',
              trigger: ['blur', 'change']
            }
          ]
        }
      },
      {
        title: 'المستخدم المستهدف',
        key: 'target_user',
        search: {
          disabled: true
        },
        width: 130,
        type: 'table-selector',
        disabled: true,
        dict: {
          cache: false,
          url: '/api/system/user/',
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
            span: 24,
            show (context) {
              return context.form.target_type === 0
            },
            pagination: true,
            props: { multiple: true },
            elProps: {
              columns: [
                {
                  field: 'name',
                  title: 'اسم المستخدم'
                },
                {
                  field: 'phone',
                  title: 'مكالمة هاتفية المستخدم'
                }
              ]
            }
          }
        },
        component: {
          name: 'manyToMany',
          valueBinding: 'user_info',
          children: 'name'
        }
      },
      {
        title: 'دور الهدف',
        key: 'target_role',
        search: {
          disabled: true
        },
        disabled: true,
        width: 130,
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
            span: 24,
            show (context) {
              return context.form.target_type === 1
            },
            pagination: true,
            props: { multiple: true },
            elProps: {
              columns: [
                {
                  field: 'name',
                  title: 'اسم الشخصية'
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
        title: 'قسم الهدف',
        key: 'target_dept',
        search: {
          disabled: true
        },
        width: 130,
        type: 'table-selector',
        dict: {
          cache: false,
          url: '/api/system/dept/all_dept/',
          isTree: true,
          value: 'id', // قاموس البياناتvalueاسم السمة الحقل
          label: 'name', // قاموس البياناتlabelاسم السمة الحقل
          children: 'children', // قاموس البياناتchildrenاسم السمة الحقل
          getData: (url, dict, {
            form,
            component
          }) => {
            return request({
              url: url
            }).then(ret => {
              return ret.data
            })
          }
        },
        disabled: true,
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
            span: 24,
            show (context) {
              return context.form.target_type === 2
            },
            props: {
              multiple: true,
              elProps: {
                treeConfig: {
                  transform: true,
                  rowField: 'id',
                  parentField: 'parent',
                  expandAll: true
                },
                columns: [
                  {
                    field: 'name',
                    title: 'اسم القسم',
                    treeNode: true
                  },
                  {
                    field: 'status_label',
                    title: 'ولاية'
                  },
                  {
                    field: 'parent_name',
                    title: 'الوالد -قسم المستوى'
                  }
                ]
              }
            }
          }
        },
        component: {
          name: 'manyToMany',
          valueBinding: 'dept_info',
          children: 'name'
        }
      },
      {
        title: 'محتوى',
        key: 'content',
        minWidth: 300,
        type: 'editor-quill', // FU Text Picture تحميل التبعياتfile-uploader，الرجاء تكوينه أولاًfile-uploader
        form: {
          rules: [ // قواعد التحقق من النموذج
            {
              required: true,
              message: 'يتطلب عنصر'
            }
          ],
          component: {
            disabled: () => {
              return vm.getEditForm().disable
            },
            props: {
              uploader: {
                type: 'form' // قم بتحميل نوع الخلفية【cos,aliyun,oss,form】
              }
            },
            events: {
              'text-change': (event) => {
                console.log('text-change:', event)
              }
            }
          }
        }
      }
    ].concat(vm.commonEndColumns({
      create_datetime: { showTable: true },
      update_datetime: { showTable: false }
    }))
  }
}
