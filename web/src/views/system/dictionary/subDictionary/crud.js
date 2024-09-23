export const crudOptions = (vm) => {
  return {

    pageOptions: {
      compact: true
    },
    options: {
      rowId: 'id',
      height: '100%', // ارتفاع100%, يستخدمtoolbarيجب تعيين
      border: false
    },
    rowHandle: {
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
    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      appendToBody: true, // sub -able يجب خلاف ذلك ، لا يمكن لمربع الحوار عرض المستوى العلوي
      defaultSpan: 24, // النموذج الافتراضي span
      width: '35%'
    },
    columns: [
      {
        title: 'اسم',
        key: 'label',

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
            { required: true, message: 'اسميتطلب عنصر' }
          ],
          component: {
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولاسم'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'نوع البيانات',
        type: 'select',
        key: 'type',
        search: {
          disabled: true,
          component: {
            props: {
              clearable: true
            }
          }
        },
        show: false,
        dict: {
          data: [
            { label: 'text', value: 0 },
            { label: 'number', value: 1 },
            { label: 'date', value: 2 },
            { label: 'datetime', value: 3 },
            { label: 'time', value: 4 },
            { label: 'file', value: 5 },
            { label: 'boolean', value: 6 },
            { label: 'images', value: 7 }
          ]
        },
        form: {
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'نوع البياناتيتطلب عنصر' }
          ],
          value: 0,
          component: {
            props: {
              clearable: true
            },
            placeholder: 'يختارنوع البيانات'
          },
          itemProps: {
            class: { yxtInput: true }
          },
          valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
            const template = vm.getEditFormTemplate('value')
            // بعد اختيار المربع وإعادة الإصلاح，حالةvalueقيمة
            if (!immediate) {
              form.value = undefined
            }
            if (value === 0) {
              template.component.name = 'el-input'
            } else if (value === 1) {
              template.component.name = 'el-input-number'
            } else if (value === 2) {
              template.component.name = 'el-date-picker'
              template.component.props = {
                type: 'date',
                valueFormat: 'yyyy-MM-dd'
              }
            } else if (value === 3) {
              template.component.name = 'el-date-picker'
              template.component.props = {
                type: 'datetime',
                valueFormat: 'yyyy-MM-dd HH:mm:ss'
              }
            } else if (value === 4) {
              template.component.name = 'el-time-picker'
              template.component.props = {
                pickerOptions: {
                  arrowControl: true
                },
                valueFormat: 'HH:mm:ss'
              }
            } else if (value === 5) {
              template.component.name = 'd2p-file-uploader'
              template.component.props = { elProps: { listType: 'text' } }
            } else if (value === 6) {
              template.component.name = 'dict-switch'
              template.component.value = true
              template.component.props = {
                dict: {
                  data: [
                    { label: 'نعم', value: 'true' },
                    { label: 'لا', value: 'false' }
                  ]
                }
              }
            } else if (value === 7) {
              template.component.name = 'd2p-cropper-uploader'
              template.component.props = { accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif', cropper: { viewMode: 1 } }
            }
          },
          valueChangeImmediate: true
        }
      },
      {
        title: 'بياناتقيمة',
        key: 'value',
        search: {
          disabled: true,
          component: {
            props: {
              clearable: true
            }
          }
        },
        view: {
          component: { props: { height: 100, width: 100 } }
        },
        // عند التقديم,بيانات العملية
        valueResolve (row, col) {
          const value = row[col.key]
          const type = row.type
          if (type === 5 || type === 7) {
            if (value != null) {
              if (value.length >= 0) {
                if (value instanceof Array) {
                  row[col.key] = value.toString()
                } else {
                  row[col.key] = value
                }
              } else {
                row[col.key] = null
              }
            }
          } else {
            row[col.key] = value
          }
        },
        // عند تلقي,بيانات العملية
        valueBuilder (row, col) {
          const value = row[col.key]
          const type = row.type
          if (type === 5 || type === 7) {
            if (value != null && value) {
              row[col.key] = value.split(',')
            }
          } else {
            row[col.key] = value
          }
        },
        type: 'input',
        form: {
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'بياناتقيمةيتطلب عنصر' }
          ],
          component: {
            props: {
              clearable: true
            },
            placeholder: 'الرجاء الدخولبياناتقيمة'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      }, {
        title: 'ولاية',
        key: 'status',
        width: 80,
        search: {
          disabled: false
        },
        type: 'radio',
        dict: {
          data: vm.dictionary('button_status_bool')
        },
        form: {
          value: true,
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'ولايةيتطلب عنصر' }
          ],
          component: {
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'نوع',
        key: 'sort',
        width: 70,
        type: 'number',
        form: {
          value: 1,
          component: {
          },
          rules: [ // قواعد التحقق من النموذج
            { required: true, message: 'نوعيتطلب عنصر' }
          ],
          itemProps: {
            class: { yxtInput: true }
          }
        }
      }, {
        title: 'لون العلامة',
        key: 'color',
        width: 90,
        search: {
          disabled: true
        },
        type: 'select',
        dict: {
          data: [
            { label: 'success', value: 'success', color: 'success' },
            { label: 'primary', value: 'primary', color: 'primary' },
            { label: 'info', value: 'info', color: 'info' },
            { label: 'danger', value: 'danger', color: 'danger' },
            { label: 'warning', value: 'warning', color: 'warning' }
          ]
        },
        form: {
          component: {
            props: {
              clearable: true
            }
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      }
    ].concat(vm.commonEndColumns({
      update_datetime: {
        showForm: false,
        showTable: false
      },
      create_datetime: {
        showForm: false,
        showTable: false
      }
    }))
  }
}
