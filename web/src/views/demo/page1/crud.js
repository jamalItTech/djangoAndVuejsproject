import { request } from '@/api/service'
export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      height: '100%'
    },
    viewOptions: {
      componentType: 'row'
    },
    formOptions: {
      defaultSpan: 12 // النموذج الافتراضي span
    },
    columns: [
      {
        title: 'الترميز',
        key: 'id',
        width: 90,
        form: {
          disabled: true
        }
      },
      {
        title: 'وحيد',
        key: 'select1',
        sortable: true,
        search: {
          disabled: true
        },
        type: 'table-selector',
        dict: {
          url: '/api/system/user/',
          value: 'id', // قاموس البياناتvalueاسم السمة الحقل
          label: 'name', // قاموس البياناتlabelاسم السمة الحقل
          getData: (url, dict, { form, component }) => {
            return request({ url: url, params: { page: 1, limit: 1 } }).then(ret => {
              component._elProps.page = ret.data.page
              component._elProps.limit = ret.data.limit
              component._elProps.total = ret.data.total

              return ret.data.data
            })
          }
        },
        form: {
          component: {
            span: 12,
            props: { multiple: true },
            elProps: {
              pagination: true,
              columns: [
                {
                  field: 'name',
                  title: 'اسم'
                },
                {
                  field: 'username',
                  title: 'حساب'
                },
                {
                  field: 'role',
                  title: 'دورId'
                },
                {
                  field: 'dept',
                  title: 'قسمId'
                }

              ]
            }
          }
        }
      },
      {
        title: 'الصورة الرمزية',
        key: 'image',
        // type: 'image-uploader',
        type: 'avatar-uploader',
        width: 150,
        align: 'left',
        form: {
          component: {
            props: {
              elProps: { // وel-uploader إعدادات
                multiple: false,
                limit: 5 // حد5ملف فردي
              },
              sizeLimit: 50 * 1024 // لا يمكن أن تتجاوزحد
            },
            span: 24
          },
          helper: 'حد文件大小لا يمكن أن تتجاوز50k'
        }
      },
      {
        title: 'صورة',
        key: 'files',
        type: 'image-uploader',
        width: 150,
        align: 'left',
        form: {
          component: {
            props: {
              elProps: { // وel-uploader إعدادات
                multiple: false,
                limit: 5 // حد5ملف فردي
              },
              sizeLimit: 50 * 1024 // لا يمكن أن تتجاوزحد
            },
            span: 24
          },
          helper: 'حد文件大小لا يمكن أن تتجاوز50k'
        }
      },
      {
        title: 'خيار,محلي,الصباغة التلقائية',
        key: 'select2',
        sortable: true,
        width: 180,
        search: {
          disabled: false,
          title: 'خيار'
        },
        type: 'select',
        form: {
          title: 'خيارمحلي',
          component: {
            props: {
              filterable: true,
              multiple: true,
              clearable: true
            }
          }
        },
        dict: {
          data: [{ value: 'sz', label: 'شنتشن' }, { value: 'gz', label: 'قوانغتشو' }, { value: 'wh', label: 'ووهان' }, { value: 'sh', label: 'شنغهاي' }]
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }
    ]
  }
}
