import { request } from '@/api/service'
import { urlPrefix as menuPrefix } from './api'
import XEUtils from 'xe-utils'
export const crudOptions = (vm) => {
  // تحقق من عنوان التوجيه
  const validateWebPath = (rule, value, callback) => {
    const isLink = vm.getEditForm().is_link
    let pattern = /^\/.*?/
    if (isLink) {
      pattern = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/g
    } else {
      pattern = /^\/.*?/
    }
    if (!pattern.test(value)) {
      callback(new Error('الرجاء تصحيح العنوان'))
    } else {
      callback()
    }
  }
  return {
    pagination: false,
    pageOptions: {
      compact: true
    },
    options: {
      tableType: 'vxe-table',
      rowKey: true,
      rowId: 'id',
      height: '100%', // ارتفاع100%, يستخدمtoolbarيجب تعيين
      highlightCurrentRow: false,
      // defaultExpandAll: true,
      // expandAll: true,
      treeConfig: {
        transform: true,
        rowField: 'id',
        parentField: 'parent',
        expandAll: true,
        hasChild: 'hasChild',
        lazy: true,
        loadMethod: vm.loadContentMethod
      }
    },
    rowHandle: {
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
      width: 230,
      fixed: 'right',
      custom: [{
        show (index, row) {
          if (row.web_path && !row.is_link) {
            return true
          }
          return false
        },
        disabled () {
          return !vm.hasPermissions('Update')
        },
        text: ' زر القائمة',
        type: 'warning',
        size: 'small',
        emit: 'createPermission'
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
      defaultSpan: 12 // النموذج الافتراضي span
    },
    columns: [
      {
        title: 'الكلمة الرئيسية',
        key: 'search',
        show: false,
        disabled: true,
        search: {
          disabled: false,
          component: {
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولالكلمة الرئيسية'
          }
        },
        form: {
          disabled: true,
          component: {
            props: {
              clearable: true
            }
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
        width: 60,
        form: {
          component: {
            show: false
          }
        }
      },
      {
        title: 'القائمة الوالدين',
        key: 'parent',
        show: false,
        search: {
          disabled: true
        },
        type: 'cascader',
        dict: {
          url: menuPrefix,
          cache: false,
          isTree: true,
          value: 'id', // قاموس البياناتvalueاسم السمة الحقل
          label: 'name', // قاموس البياناتlabelاسم السمة الحقل
          children: 'children', // قاموس البياناتchildrenاسم السمة الحقل
          getData: (url, dict, { form, component }) => { // تكوين هذه المعلمة سيغطي الموقف العامgetRemoteDictFunc
            return request({ url: url, params: { limit: 999, status: 1, is_catalog: 1 } }).then(ret => {
              const responseData = ret.data.data
              const result = XEUtils.toArrayTree(responseData, { parentKey: 'parent', strict: true })
              return [{ id: null, name: 'عقدة الجذر', children: result }]
            })
          }
        },
        form: {
          component: {
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
        title: 'اسم القائمة',
        key: 'name',
        sortable: true,
        treeNode: true, // تعيين عمود شجرة
        search: {
          disabled: false,
          component: {
            props: {
              clearable: true
            }
          }
        },
        minWidth: 180,
        type: 'input',
        form: {
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'اسم القائمةيتطلب عنصر' }
          ],
          component: {
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولاسم القائمة'
          },
          itemProps: {
            class: { yxtInput: true }
          }

        }
      },
      {
        title: 'رمز',
        key: 'icon',
        width: 60,
        type: 'icon-selector',
        form: {
          component: {
            placeholder: 'الرجاء الدخولرمز'
          }
        }
      },
      {
        title: 'نوع',
        key: 'sort',
        width: 60,
        type: 'number',
        form: {
          value: 1,
          component: {
            placeholder: 'الرجاء الدخولنوع'
          }
        }
      },
      {
        title: 'سواء للدليل',
        key: 'is_catalog',
        width: 100,
        type: 'dict-switch',
        search: {
          disabled: true
        },
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: false,
          component: {
            placeholder: 'يختارسواء للدليل'
          },
          valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
            if (!value) {
              form.web_path = undefined
              form.component = undefined
              form.component_name = undefined
              form.cache = false
              form.is_link = false
            }
          }
        }
      },
      {
        title: 'الرابط الخارجي',
        key: 'is_link',
        width: 70,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: false,
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog
            },
            placeholder: 'يختار是否الرابط الخارجي'
          },
          valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
            form.web_path = undefined
            form.component = undefined
            form.component_name = undefined
            if (value) {
              getColumn('web_path').title = 'الرابط الخارجيعنوان'
              getColumn('web_path').component.placeholder = 'الرجاء الدخولالرابط الخارجيعنوان'
              getColumn('web_path').helper = {
                render (h) {
                  return (< el-alert title="الرابط الخارجيعنوان,لو سمحتhttps|http|ftp|rtsp|mmsبداية" type="warning" />
                  )
                }
              }
            } else {
              getColumn('web_path').title = 'عنوان التوجيه'
              getColumn('web_path').component.placeholder = 'الرجاء الدخولعنوان التوجيه'
              getColumn('web_path').helper = {
                render (h) {
                  return (< el-alert title="في المتصفحurlعنوان,لو سمحت/بداية" type="warning" />
                  )
                }
              }
            }
          }
        }
      },
      {
        title: 'عنوان التوجيه',
        key: 'web_path',
        width: 150,
        show: false,
        form: {
          rules: [
            { required: true, message: 'الرجاء الدخول正确的عنوان التوجيه' },
            { validator: validateWebPath, trigger: 'change' }
          ],
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog
            },
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولعنوان التوجيه'
          },
          helper: {
            render (h) {
              return (< el-alert title="في المتصفحurlعنوان,لو سمحت/بداية" type="warning" />
              )
            }
          }
        }
      },
      {
        title: 'عنوان المكون',
        key: 'component',
        type: 'select',
        show: false,
        dict: {
          cache: false,
          data: vm.searchFiles()
        },
        form: {
          rules: [
            { required: true, message: 'يختارعنوان المكون' }
          ],
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog && !form.is_link
            },
            props: {
              clearable: true,
              filterable: true // يمكن تصفية عناصر اختيار
            },
            placeholder: 'الرجاء الدخولعنوان المكون'
          },
          helper: {
            render (h) {
              return (< el-alert title="src/viewsعنوان المجلد أدناه" type="warning" />
              )
            }
          }
        }
      },
      {
        title: 'اسم المكون',
        key: 'component_name',
        width: 170,
        form: {
          rules: [
            { required: true, message: 'الرجاء الدخولاسم المكون' }
          ],
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog && !form.is_link
            },
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولاسم المكون'
          },
          helper: {
            render (h) {
              return (< el-alert title="xx.vueفي الملفname" type="warning" />
              )
            }
          }
        }
      },
      {
        title: 'سلطة',
        key: 'menuPermission',
        type: 'select',
        width: 300,
        form: {
          disabled: true,
          component: {
            elProps: { // el-selectعنصر التكوين，https://element.eleme.cn/#/zh-CN/component/select
              filterable: true,
              multiple: true,
              clearable: true
            }
          }
        }
      },
      {
        title: 'مخبأ',
        key: 'cache',
        search: {
          disabled: false
        },
        width: 60,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: false,
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog
            },
            placeholder: 'يختار是否مخبأ'
          },
          helper: {
            render (h) {
              return (< el-alert title="ما إذا كنت تفتح الصفحةمخبأ,يحتاجاسم المكونوxx.vueصفحةnameثابت" type="warning" />
              )
            }
          }
        }
      },
      {
        title: 'مرئي على الجانب',
        key: 'visible',
        search: {
          disabled: false
        },
        width: 75,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: true,
          component: {
            placeholder: 'يختارمرئي على الجانب'
          },
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'مرئي على الجانبيتطلب عنصر' }
          ],
          helper: {
            render (h) {
              return (< el-alert title="سواء تم عرضه في القائمة الجانبية" type="warning" />
              )
            }
          }
        }
      }, {
        title: 'خارج الإطار الرئيسي',
        key: 'frame_out',
        search: {
          disabled: false
        },
        width: 75,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: false,
          component: {
            placeholder: 'يختارخارج الإطار الرئيسي'
          },
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'خارج الإطار الرئيسييتطلب عنصر' }
          ],
          helper: {
            render (h) {
              return (< el-alert title="ما إذا كان يتم عرضه فيخارج الإطار الرئيسي" type="warning" />
              )
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
        width: 70,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_status_bool')
        },
        form: {
          value: true,
          component: {
            placeholder: 'يختارولاية'
          },
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'ولايةيتطلب عنصر' }
          ]
        }
      }
    ].concat(vm.commonEndColumns({
      update_datetime: { showTable: false }
    }))
  }
}
