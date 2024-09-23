import { request } from '@/api/service'

export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      tableType: 'vxe-table',
      rowKey: false, // يجب تعيين，true or false
      height: '100%',
      rowId: 'code',
      highlightCurrentRow: true,
      treeConfig: { // تكوين بيانات الشجرة
        lazy: true,
        children: 'children',
        hasChild: 'hasChildren',
        loadMethod: ({ row }) => {
          return request({
            url: '/api/system/area/',
            method: 'get',
            params: { pcode: row.code, limit: 999 }
          }).then(ret => {
            ret.data.data.map(value => { value.hasChildren = value.pcode_count !== 0 })
            row.hasChildren = false
            return ret.data.data
          })
        },
        iconLoaded: 'el-icon-loading' // تجميلloadingرمز
      }
    },
    // rowHandle: {
    //   show: false,
    //   width: 140,
    //   view: {
    //     thin: true,
    //     text: '',
    //     show: false,
    //     disabled () {
    //       return !vm.hasPermissions('Retrieve')
    //     }
    //   },
    //   edit: {
    //     thin: true,
    //     text: '',
    //     show: false,
    //     disabled () {
    //       return !vm.hasPermissions('Update')
    //     }
    //   },
    //   remove: {
    //     thin: true,
    //     text: '',
    //     show: false,
    //     disabled () {
    //       return !vm.hasPermissions('Delete')
    //     }
    //   }
    // },
    rowHandle: false,
    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      defaultSpan: 24, // النموذج الافتراضي span
      width: '30%'
    },
    indexRow: { // أو تمر مباشرةtrue,لا تعرضtitle，غير شعبية
      title: 'رقم سري',
      align: 'center',
      width: 100
    },
    columns: [
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
        title: 'الوالدين -منطقة المستوى',
        key: 'pcode',
        show: false,
        search: {
          disabled: false
        },
        type: 'area-selector',
        // dict: {
        //   url: areaJointPrefix,
        //   lazy: true,
        //   isTree: true,
        //   cache: false,
        //   value: 'code', // قاموس البياناتvalueاسم السمة الحقل
        //   label: 'name', // قاموس البياناتlabelاسم السمة الحقل
        //   children: 'children' // قاموس البياناتchildrenاسم السمة الحقل
        // },
        valueResolve (row, key) {
          if (row.pcode === null) {
            row.pcode = undefined
          }
        },
        form: {
          component: {
            showAllLevels: false, // فقط عرض المستوى الأخير
            props: {
              elProps: {
                clearable: true,
                showAllLevels: false, // فقط عرض المستوى الأخير
                props: {
                  checkStrictly: true, // لا حاجة لاختيار المستوى الأخير
                  emitPath: false,
                  clearable: true
                }
              }
            }
          }
        }
      },
      {
        title: 'اسم',
        key: 'name',
        search: {
          disabled: false
        },
        treeNode: true,
        width: 160,
        type: 'input',
        form: {
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'اسميتطلب عنصر' }
          ],
          component: {
            placeholder: 'الرجاء الدخولاسم'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'الترميز الإقليمي',
        key: 'code',
        search: {
          disabled: false
        },
        type: 'input',
        form: {
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'الترميز الإقليمييتطلب عنصر' }
          ],
          component: {
            placeholder: 'الرجاء الدخولالترميز الإقليمي'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'بينين',
        key: 'pinyin',
        search: {
          disabled: true
        },
        type: 'input',
        form: {
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'بينينيتطلب عنصر' }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            placeholder: 'الرجاء الدخولبينين'
          }
        }
      }, {
        title: 'المستوى الإقليمي',
        key: 'level',
        search: {
          disabled: true
        },
        type: 'input',
        form: {
          disabled: false,
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'بينينيتطلب عنصر' }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            placeholder: 'الرجاء الدخولبينين'
          }
        }
      }, {
        title: 'الرسالة الأولى',
        key: 'initials',
        form: {
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'الرسالة الأولىيتطلب عنصر' }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            placeholder: 'الرجاء الدخولالرسالة الأولى'
          }
        }
      },
      {
        title: 'سواء لتمكين',
        key: 'enable',
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
          itemProps: {
            class: { yxtInput: true }
          }
        }
      }
    ].concat(vm.commonEndColumns())
  }
}
