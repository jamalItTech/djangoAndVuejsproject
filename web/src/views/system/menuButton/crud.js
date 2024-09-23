/*
 * @إنشاء وقت الملف: 2021-06-03 00:50:28
 * @Auther: قرد يوم صغير
 * @أخيرا تعديل الناس: قرد يوم صغير
 * @آخر وقت التعديل: 2021-07-29 22:49:02
 * يتصلQq:1638245306
 * @مقدمة الملف: زر القائمة وتكوين الواجهة
 */
import { request } from '@/api/service'
export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      tableType: 'vxe-table',
      rowKey: false,
      width: '100%',
      height: '100%' // ارتفاع100%, يستخدمtoolbarيجب تعيين
    },
    rowHandle: {
      width: 180,
      edit: {
        thin: true,
        text: 'يحرر'
      },
      remove: {
        thin: true,
        text: 'يمسح'
      }
    },
    indexRow: { // أو تمر مباشرةtrue,لا تعرضtitle，غير شعبية
      title: 'رقم سري',
      align: 'center',
      width: 100
    },
    viewOptions: {
      disabled: true,
      componentType: 'form'
    },
    formOptions: {
      defaultSpan: 24 // النموذج الافتراضي span
    },
    columns: [{
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
        disabled: true
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
      title: 'اسم إذن',
      key: 'name',
      sortable: true,
      width: 150,
      search: {
        disabled: false
      },
      type: 'select',
      dict: {
        data: vm.dictionary('system_button'),
        label: 'label',
        value: 'label'
      },
      form: {
        rules: [ // قواعد التحقق من النموذج
          { required: true, message: 'يتطلب عنصر' }
        ],
        component: {
          span: 12,
          props: {
            clearable: true,
            elProps: {
              allowCreate: true,
              filterable: true,
              clearable: true
            }
          }
        },
        itemProps: {
          class: { yxtInput: true }
        },
        valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
          if (value != null) {
            // console.log('component.dictOptions', component.dictOptions)
            const obj = component.dictOptions.find(item => {
              // console.log(item.label, value)
              return item.label === value
            })
            if (obj && obj.value) {
              form.name = obj.label
              form.value = obj.value
            }
          }
        },
        helper: {
          render (h) {
            return (< el-alert title="يمكن إدخال القيمة الجديدة يدويًا في القائمة" type="warning" description="اقتراحات أكثر شيوعًا في إدارة القاموس"/>
            )
          }
        }
      }
    },
    {
      title: 'سلطة',
      key: 'value',
      sortable: true,
      width: 200,
      search: {
        disabled: false
      },
      type: 'input',
      form: {
        rules: [ // قواعد التحقق من النموذج
          { required: true, message: 'يتطلب عنصر' }
        ],
        component: {
          span: 12,
          placeholder: 'الرجاء الدخولسلطة',
          props: {
            elProps: {
              clearable: true
            }
          }
        },
        itemProps: {
          class: { yxtInput: true }
        },
        helper: {
          render (h) {
            return (< el-alert title="عرض الحكم لأذونات زر الوضع الأمامي" type="warning" description="يستخدمطريقة：vm.hasPermissions(سلطة)"/>
            )
          }
        }
      }
    },
    {
      title: 'طريقة طلب',
      key: 'method',
      sortable: true,
      width: 150,
      search: {
        disabled: false
      },
      type: 'select',
      dict: {
        data: [
          { label: 'GET', value: 0 },
          { label: 'POST', value: 1 },
          { label: 'PUT', value: 2 },
          { label: 'DELETE', value: 3 }
        ]
      },
      form: {
        rules: [ // قواعد التحقق من النموذج
          { required: true, message: 'يتطلب عنصر' }
        ],
        component: {
          span: 12
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    },
    {
      title: 'عنوان الواجهة',
      key: 'api',
      sortable: true,
      search: {
        disabled: true
      },
      type: 'select',
      dict: {
        url: '/swagger.json',
        label: 'label',
        value: 'value',
        getData: (url, dict) => {
          return request({ url: url }).then(ret => {
            const res = Object.keys(ret.paths)
            const data = []
            for (const item of res) {
              const obj = {}
              obj.label = item
              obj.value = item
              data.push(obj)
            }

            return data
          })
        }
      },
      form: {
        rules: [ // قواعد التحقق من النموذج
          { required: true, message: 'يتطلب عنصر' }
        ],
        component: {
          span: 24,
          props: {
            elProps: {
              allowCreate: true,
              filterable: true,
              clearable: true
            }

          }
        },
        itemProps: {
          class: { yxtInput: true }
        },
        helper: {
          render (h) {
            return (< el-alert title="يرجى ملء بشكل صحيح，حتى لا يتم اعتراضها عند الطلب。مطابقة مثال واحديستخدمعادي,على سبيل المثال:/api/xx/.*?/" type="warning" />
            )
          }
        }
      }
    }
    ]
  }
}
