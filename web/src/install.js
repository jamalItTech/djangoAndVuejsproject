import Vue from 'vue'
// import d2Crud from '@d2-project/d2-crud'
import d2CrudX from 'd2-crud-x'
import { d2CrudPlus } from 'd2-crud-plus'
import {
  D2pAreaSelector,
  D2pDemoExtend,
  D2pFullEditor,
  D2pIconSelector,
  D2pUploader
} from 'd2p-extends' // مقدمة طريقة رمز المصدر，يدعم مكون تحميل الحمل الكسول
import D2pFileUploader from '@/components/file-uploader'
// httpبسأل
import { request } from '@/api/service'
import util from '@/libs/util'
import XEUtils from 'xe-utils'
import store from '@/store/index'
import types from '@/config/d2p-extends/types'
import { checkPlugins, plugins } from '@/views/plugins'

/**
 // vxe0
 import 'xe-utils'
 import VXETable from 'vxe-table'
 import 'vxe-table/lib/index.css'
 Vue.use(VXETable)
 **/

// يمكن أن يتعايش إدخال تسمية الإعادة التالية مع الإصدار الرسمي，index.vueالفوز<d2-crud-x />نسخة محسنة
// لا تمرname，لكنd2CrudXالعلامة لا تزال<d2-crud>,لا تتعايش مع النسخة الرسمية
Vue.use(d2CrudX, { name: 'd2-crud-x' })
// يسجلdvadminقابس -في
Vue.use(plugins)
// // النسخة الرسمية【هنا مظاهرة ومظاهرةالنسخة الرسميةتعايشيقدم，يمكن استخدامها في المشروع الجديدd2-crud-xبديل كاملالنسخة الرسمية】
// Vue.use(d2Crud)
/**
 * @description يفحصقابس -فيسواء لتثبيت
 * @param {String} pluginName قابس -فياسم
 */
Vue.prototype.checkPlugins = checkPlugins
// يقدمd2CrudPlus
Vue.use(d2CrudPlus, {
  starTip: false,
  getRemoteDictFunc (url, dict) {
    // تكوين القاموس الخاص بك هناhttpبسألطريقة
    // استخدام حقيقي ، يرجى تغييرهrequest
    return request({
      url: url,
      params: dict.body,
      method: 'get'
    }).then(ret => {
      if (dict.isTree) {
        return XEUtils.toArrayTree(ret.data.data || ret.data, { parentKey: 'parent', strict: false })
      } else {
        return ret.data.data || ret.data
      }
    })
  },
  commonOption () { // التكوين العام
    return {
      format: {
        page: { // pageتكوين بنية البيانات التي يتم إرجاعها بواسطة الواجهة，
          request: {
            current: 'page',
            size: 'limit',
            orderAsc (query, value) {
              const field = query.orderProp
              if (value) {
                query.ordering = field
              } else {
                query.ordering = `-${field}`
              }
            }
          },
          response: {
            current: 'page', // رقم الصفحة الحالي ret.data.current
            size: 'limit', // رقم الصفحة الحالي ret.data.current
            // size: (data) => { return data.size }, // رقم لكل صفحة，ret.data.size, يمكنك أيضًا تكوين طريقة，مخصص
            total: 'total', // إجمالي رقم الرقم القياسي ret.data.total
            records: 'data' // صفيف قائمة ret.data.records
          }
        }
      },
      pageOptions: {
        compact: true
      },
      options: {
        size: 'small'
      },
      formOptions: {
        nullToBlankStr: true, // عند تقديم نموذج معدّل，سوفundefindedيتم تعديل البيانات إلى سلسلة فارغة''，يمكن حل المشكلة التي لا يمكن أن تكون حقول فارغة
        defaultSpan: 12, // النموذج الافتراضي span
        saveRemind: true,
        labelWidth: '110px',
        appendToBody: true
      },
      viewOptions: {
        disabled: false,
        componentType: 'form' // 【form,row】 مكون النموذج أو عرض مكون الخط
      },
      rowHandle: {
        width: 260,
        edit: {
          type: 'primary'
        }
      }
    }
  }
})

// تمديد التثبيتقابس -في
// Vue.use(D2pTreeSelector)
Vue.use(D2pAreaSelector)
Vue.use(D2pIconSelector)
Vue.use(D2pFullEditor)
Vue.use(D2pDemoExtend)
Vue.use(D2pFileUploader)
Vue.use(D2pUploader, {
  defaultType: 'form',
  cos: {
    domain: 'https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com',
    bucket: 'd2p-demo-1251260344',
    region: 'ap-guangzhou',
    secretId: '', //
    secretKey: '', // يمرsecretKey وsecretId يستخدم الممثل وضع التوقيع المحلي（غير آمن，لا ينصح بيئة الإنتاج）
    getAuthorization (custom) { // لا تمرsecretKeyيستخدم الممثل وضع التوقيع المؤقت,في هذا الوقت ، يجب تمرير هذه المعلمة（أمان，بيئة الإنتاج الموصى بها）
      return request({
        url: '/upload/cos/getAuthorization',
        method: 'get'
      }).then(ret => {
        // الهيكل الخلفي كما يلي
        // ret.data:{
        //   TmpSecretId,
        //   TmpSecretKey,
        //   XCosSecurityToken,
        //   ExpiredTime, // SDK يخرج ExpiredTime قبل الوقت，لن يتصل مرة أخرى getAuthorization
        // }
        return ret.data
      })
    }
  },
  alioss: {
    domain: 'https://d2p-demo.oss-cn-shenzhen.aliyuncs.com',
    bucket: 'd2p-demo',
    region: 'oss-cn-shenzhen',
    accessKeyId: '',
    accessKeySecret: '',
    getAuthorization (custom, context) { // لا تمرaccessKeySecretيستخدم الممثل وضع التوقيع المؤقت,في هذا الوقت ، يجب تمرير هذه المعلمة（أمان，بيئة الإنتاج الموصى بها）
      return request({
        url: '/upload/alioss/getAuthorization',
        method: 'get'
      }).then(ret => {
        return ret.data
      })
    },
    sdkOpts: { // sdkإعدادات
      secure: true // تقصيرhttpsرفع,لأمان，تعيين إلىtrue
    }
  },
  qiniu: {
    bucket: 'd2p-demo',
    getToken (custom) {
      return request({
        url: '/upload/qiniu/getToken',
        method: 'get'
      }).then(ret => {
        return ret.data // {token:xxx,expires:xxx}
      })
    },
    domain: 'http://d2p.file.veryreader.com'
  },
  form: {
    action: util.baseURL() + 'api/system/file/',
    name: 'file',
    data: {}, // رفعمعلمة إضافية
    headers () {
      return {
        Authorization: 'JWT ' + util.cookies.get('token')
      }
    },
    type: 'form',
    successHandle (ret, option) {
      if (ret.data === null || ret.data === '') {
        throw new Error('رفعيفشل')
      }
      return { url: ret.data.url, key: option.data.key, id: ret.data.id }
    },
    withCredentials: false // سواءcookie
  }
})
d2CrudPlus.util.columnResolve.addTypes(types)
// تعديل نوع الحقل الرسمي
const selectType = d2CrudPlus.util.columnResolve.getType('select')
selectType.component.props.color = 'auto' // تعديل نوع الحقل الرسمي，تعيين إلىدعم الصبغة الأوتوماتيكية
// الحصول على قاموسإعدادات
Vue.prototype.dictionary = function (name) {
  return store.state.d2admin.dictionary.data[name]
}
// الحصول على قاموسlabelقيمة
Vue.prototype.getDictionaryLabel = function (name, value) {
  const data = store.state.d2admin.dictionary.data[name]
  if (data && data instanceof Array) {
    for (var i = 0, len = data.length; i < len; i++) {
      if (data[i].value === value) {
        return data[i].label
      }
    }
    return ''
  }
  return store.state.d2admin.dictionary.data[name]
}
// نظام الاستحواذإعدادات
Vue.prototype.systemConfig = function (name) {
  return store.state.d2admin.settings.data[name]
}
// تقصيرColumns نهاية showForm：يعرضيخرجformوسط，showTable：يعرضيخرجtableوسط
Vue.prototype.commonEndColumns = function (param = {}) {
  /**
   * @param {Object} {
    description: {
      showForm: true,
      showTable: false
    },
    dept_belong_id: {
      showForm: false,
      showTable: false
    },
    modifier_name: {
      showForm: false,
      showTable: false
    },
    update_datetime: {
      showForm: false,
      showTable: true
    },
    create_datetime: {
      showForm: false,
      showTable: true
    }
  }
   */
  const showData = {
    description: {
      showForm: (param.description && param.description.showForm) !== undefined ? param.description.showForm : true,
      showTable: (param.description && param.description.showTable) !== undefined ? param.description.showTable : false
    },
    dept_belong_id: {
      showForm: (param.dept_belong_id && param.dept_belong_id.showForm) !== undefined ? param.dept_belong_id.showForm : false,
      showTable: (param.dept_belong_id && param.dept_belong_id.showTable) !== undefined ? param.dept_belong_id.showTable : false,
      showSearch: (param.dept_belong_id && param.dept_belong_id.showSearch) !== undefined ? param.dept_belong_id.showSearch : false
    },
    modifier_name: {
      showForm: (param.modifier_name && param.modifier_name.showForm) !== undefined ? param.modifier_name.showForm : false,
      showTable: (param.modifier_name && param.modifier_name.showTable) !== undefined ? param.modifier_name.showTable : false
    },
    update_datetime: {
      showForm: (param.update_datetime && param.update_datetime.showForm) !== undefined ? param.update_datetime.showForm : false,
      showTable: (param.update_datetime && param.update_datetime.showTable) !== undefined ? param.update_datetime.showTable : true
    },
    creator_name: {
      showForm: (param.creator_name && param.creator_name.showForm) !== undefined ? param.creator_name.showForm : false,
      showTable: (param.creator_name && param.creator_name.showTable) !== undefined ? param.creator_name.showTable : false
    },
    create_datetime: {
      showForm: (param.create_datetime && param.create_datetime.showForm) !== undefined ? param.create_datetime.showForm : false,
      showTable: (param.create_datetime && param.create_datetime.showTable) !== undefined ? param.create_datetime.showTable : true
    }
  }
  return [
    {
      title: 'ملاحظة',
      key: 'description',
      show: showData.description.showTable,
      search: {
        disabled: true
      },
      type: 'textarea',
      form: {
        disabled: !showData.description.showForm,
        component: {
          placeholder: 'الرجاء إدخال المحتوى',
          showWordLimit: true,
          maxlength: '200',
          props: {
            type: 'textarea'
          }
        }
      }
    },
    {
      title: 'شخص معدّل',
      show: showData.modifier_name.showTable,
      width: 100,
      key: 'modifier_name',
      form: {
        disabled: !showData.modifier_name.showForm
      }
    },
    {
      title: 'قسم تابع',
      key: 'dept_belong_id',
      show: showData.dept_belong_id.showTable,
      width: 150,
      search: {
        disabled: !showData.dept_belong_id.showSearch
      },
      type: 'tree-selector',
      dict: {
        cache: false,
        url: '/api/system/dept/all_dept/',
        // isTree: true,
        // dept: true,
        value: 'id', // قاموس البياناتوسطvalueاسم السمة الحقل
        label: 'name', // قاموس البياناتوسطlabelاسم السمة الحقل
        children: 'children' // قاموس البياناتوسطchildrenاسم السمة الحقل
        // getData: (url, dict, {
        //   _,
        //   component
        // }) => {
        //   return request({
        //     url: url
        //   }).then(ret => {
        //     return XEUtils.toArrayTree(ret.data, { parentKey: 'parent', strict: false })
        //   })
        // }
      },
      component: {
        name: 'dept-format',
        props: { multiple: false, clearable: true }
      },
      form: {
        disabled: !showData.dept_belong_id.showForm,
        component: {
          props: { multiple: false, clearable: true }
        },
        helper: {
          render (h) {
            return (< el-alert title="تقصيرلا تملألكنالقسم الذي يقوم فيه المستخدم حاليًا بإنشاء المستخدمID" type="info" />
            )
          }
        }
      },
      // عند تلقي,بيانات العملية
      valueBuilder (row, col) {
        if (row[col.key]) {
          row[col.key] = Number(row[col.key])
        }
      }
    },
    {
      title: 'تحديث الوقت',
      key: 'update_datetime',
      width: 160,
      show: showData.update_datetime.showTable,
      type: 'datetime',
      sortable: true,
      form: {
        disabled: !showData.update_datetime.showForm
      }
    },
    {
      title: 'وقت الخلق',
      key: 'create_datetime',
      width: 160,
      search: {
        disabled: !showData.create_datetime.showForm,
        width: 240,
        component: { // مكون مربع الاستعلامإعدادات，تقصيروفقformإعداداتيولد
          name: 'el-date-picker',
          props: {
            type: 'daterange',
            'range-separator': 'ل',
            'start-placeholder': 'يبدأ',
            'end-placeholder': 'ينهي',
            valueFormat: 'yyyy-MM-dd'
          }
        }
      },
      show: showData.create_datetime.showTable,
      type: 'datetime',
      sortable: true,
      form: {
        disabled: !showData.create_datetime.showForm
      }
    }
  ]
}
