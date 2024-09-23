import util from '@/libs/util.js'

export default {
  'image-uploader': {
    form: { component: { name: 'd2p-file-uploader', props: { elProps: { listType: 'picture-card', accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif' } } } },
    component: { name: 'd2p-images-format' },
    view: {
      component: { props: { height: 100, width: 100 } }
    },
    align: 'center',
    // عند التقديم,بيانات العملية
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // القضاء على البادئة
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // القضاء على البادئة
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // عند تلقي,بيانات العملية
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // تطوير العنوان，العنوان الصحيح
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'avatar-uploader': {
    form: { component: { name: 'd2p-file-uploader', props: { elProps: { limit: 1, listType: 'avatar', accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif', showFileList: false } } } },
    component: { name: 'd2p-images-format' },
    view: {
      component: { props: { height: 100, width: 100 } }
    },
    align: 'center',
    // عند التقديم,بيانات العملية
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // القضاء على البادئة
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // القضاء على البادئة
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // عند تلقي,بيانات العملية
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // تطوير العنوان，العنوان الصحيح
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'video-uploader': {
    form: { component: { name: 'd2p-file-uploader', props: { elProps: { limit: 1, listType: 'video', accept: '.avi,.wmv,.mpg,.mpeg,.mov,.rm,.ram,.swf,.flv,.mp4,.mp3,.wma,.avi,.rm,.rmvb,.flv,.mpg,.mkv', showFileList: false } } } },
    component: { name: 'd2p-images-format' },
    view: {
      component: { props: { height: 100, width: 100 } }
    },
    align: 'center',
    // عند التقديم,بيانات العملية
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // القضاء على البادئة
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // القضاء على البادئة
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // عند تلقي,بيانات العملية
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // تطوير العنوان，العنوان الصحيح
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'file-uploader': {
    form: { component: { name: 'd2p-file-uploader', props: { elProps: { listType: 'text' } } } },
    component: { name: 'd2p-files-format' },
    // عند التقديم,بيانات العملية
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // القضاء على البادئة
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // القضاء على البادئة
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // عند تلقي,بيانات العملية
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // تطوير العنوان，العنوان الصحيح
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'avatar-cropper': {
    form: { component: { name: 'd2p-cropper-uploader', props: { accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif', cropper: { viewMode: 1 } } } },
    component: { name: 'd2p-images-format' },
    align: 'center',
    view: {
      component: { props: { height: 100, width: 100 } }
    },
    // عند التقديم,بيانات العملية
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // القضاء على البادئة
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // القضاء على البادئة
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // عند تلقي,بيانات العملية
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // تطوير العنوان，العنوان الصحيح
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'tree-selector': {
    form: { component: { name: 'd2p-tree-selector', props: { } } },
    component: { name: 'values-format', props: {} }
  },
  'input-required': {
    form: {
      component: {
        props: { },
        clearable: true,
        placeholder: 'الرجاء الدخول'
      },
      rules: [{ required: true, message: 'الرجاء الدخول' }],
      itemProps: {
        class: { yxtInput: true }
      }
    }
  },
  input: {
    form: {
      component: {
        props: { },
        clearable: true,
        placeholder: 'الرجاء الدخول'
      },
      itemProps: {
        class: { yxtInput: true }
      }
    }
  },
  'editor-ueditor': {
    form: {
      component: {
        name: 'd2p-ueditor',
        span: 24,
        props: {
          config: {
            serverUrl: util.baseURL() + 'api/system/file/ueditor/',
            headers: { Authorization: 'JWT ' + util.cookies.get('token') },
            imageUrlPrefix: util.baseFileURL(),
            // تحميل صورة الكتابة على الجدران
            scrawlUrlPrefix: util.baseFileURL(),
            // تحميل لقطات
            snapscreenUrlPrefix: util.baseFileURL(),
            // فهم بادئة مسار الصورة عن بُعد
            catcherUrlPrefix: util.baseFileURL(),
            // مسار الوصول إلى الفيديو منقط
            videoUrlPrefix: util.baseFileURL(),
            // منقط مسار الوصول إلى الملف
            fileUrlPrefix: util.baseFileURL(),
            // سرد الصورة في الدليل المحدد
            imageManagerUrlPrefix: util.baseFileURL(),
            // سرد الملف في الدليل المحدد
            fileManagerUrlPrefix: util.baseFileURL()
            // وضع فيueditorإعدادات
            // مرجع الوثيقة： http://fex.baidu.com/ueditor/#start-config
          }
        }
      }
    }
  }
}
