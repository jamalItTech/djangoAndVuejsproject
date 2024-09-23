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
        title: 'طريقة طلب',
        key: 'method',
        sortable: true,
        search: {
          disabled: false
        },
        type: 'select',
        dict: {
          data: [
            {
              label: 'GET',
              value: 0
            },
            {
              label: 'POST',
              value: 1
            },
            {
              label: 'PUT',
              value: 2
            },
            {
              label: 'DELETE',
              value: 3
            }
          ]
        },
        form: {
          rules: [ // قواعد التحقق من النموذج
            {
              required: true,
              message: 'يتطلب عنصر'
            }
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
        key: 'url',
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
            {
              required: true,
              message: 'يتطلب عنصر'
            }
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
              return (< el-alert title="يرجى ملء بشكل صحيح，حتى لا يتم اعتراضها عند الطلب。مطابقة مثال واحديستخدمعادي,على سبيل المثال:/api/xx/.*?/" type="warning"/>
              )
            }
          }
        }
      },
      {
        title: 'شهادة إذن البيانات',
        key: 'enable_datasource',
        search: {
          disabled: false
        },
        width: 150,
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
        title: 'ملاحظة',
        key: 'description',
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
      }
    ]
  }
}
