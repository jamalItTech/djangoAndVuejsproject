const log = [
  {
    i: 'usersTotal0',
    x: 0,
    y: 0,
    w: 12,
    h: 12,
    config: {
      color: {
        label: 'لون الخلفية',
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'اللون فارغ ويتم تحويل اللون بشكل عشوائي'
      },
      fontColor: {
        label: 'لون الخط',
        type: 'color',
        value: null,
        placeholder: 'يختارلون الخط'
      }
    },
    isResizable: true,
    element: 'usersTotal',
    moved: false
  },
  {
    i: 'loginTotal1',
    x: 12,
    y: 0,
    w: 12,
    h: 12,
    config: {
      color: {
        label: 'لون الخلفية',
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'اللون فارغ ويتم تحويل اللون بشكل عشوائي'
      },
      fontColor: {
        label: 'لون الخط',
        type: 'color',
        value: null,
        placeholder: 'يختارلون الخط'
      }
    },
    isResizable: true,
    element: 'loginTotal',
    moved: false
  },
  {
    i: 'attachmentTotal2',
    x: 24,
    y: 0,
    w: 12,
    h: 12,
    config: {
      color: {
        label: 'لون الخلفية',
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'اللون فارغ ويتم تحويل اللون بشكل عشوائي'
      },
      fontColor: {
        label: 'لون الخط',
        type: 'color',
        value: null,
        placeholder: 'يختارلون الخط'
      }
    },
    isResizable: true,
    element: 'attachmentTotal',
    moved: false
  },
  {
    i: 'databaseTotal3',
    x: 36,
    y: 0,
    w: 12,
    h: 12,
    config: {
      color: {
        label: 'لون الخلفية',
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'اللون فارغ ويتم تحويل اللون بشكل عشوائي'
      },
      fontColor: {
        label: 'لون الخط',
        type: 'color',
        value: null,
        placeholder: 'يختارلون الخط'
      }
    },
    isResizable: true,
    element: 'databaseTotal',
    moved: false
  },
  {
    i: 'userLogin6',
    x: 14,
    y: 12,
    w: 17,
    h: 24,
    config: {},
    isResizable: true,
    element: 'userLogin',
    moved: false
  },
  {
    i: 'registeredUser7',
    x: 31,
    y: 12,
    w: 17,
    h: 24,
    config: {},
    isResizable: true,
    element: 'registeredUser',
    moved: false
  },
  {
    i: 'dashboardImg8',
    x: 14,
    y: 58,
    w: 16,
    h: 14,
    config: {
      src: {
        label: 'عنوان الصورة',
        type: 'input',
        value: 'https://kfm-waiter.oss-cn-zhangjiakou.aliyuncs.com/dvadmin/img/chajianshichang.jpg',
        placeholder: 'الرجاء الدخولعنوان الصورة',
        rules: [
          {
            required: true,
            message: 'لا يمكن أن تكون فارغة'
          }
        ]
      },
      url: {
        label: 'عنوان القفز',
        type: 'input',
        placeholder: 'الرجاء الدخولعنوان القفز',
        value: 'https://bbs.django-vue-admin.com/plugMarket.html',
        rules: [
          {
            required: true,
            message: 'لا يمكن أن تكون فارغة'
          }
        ]
      }
    },
    isResizable: true,
    element: 'dashboardImg',
    moved: false
  },
  {
    i: 'dashboardImg9',
    x: 0,
    y: 58,
    w: 14,
    h: 14,
    config: {
      src: {
        label: 'عنوان الصورة',
        type: 'input',
        value: '/image/card/tencent.jpg',
        placeholder: 'الرجاء الدخولعنوان الصورة',
        rules: [
          {
            required: true,
            message: 'لا يمكن أن تكون فارغة'
          }
        ]
      },
      url: {
        label: 'عنوان القفز',
        type: 'input',
        placeholder: 'الرجاء الدخولعنوان القفز',
        value: 'https://cloud.tencent.com/act/cps/redirect?redirect=1060&cps_key=b302a514a6688aa30823fac954464e5d&from=console',
        rules: [
          {
            required: true,
            message: 'لا يمكن أن تكون فارغة'
          }
        ]
      }
    },
    isResizable: true,
    element: 'dashboardImg',
    moved: false
  },
  {
    i: 'dashboardImg10',
    x: 30,
    y: 58,
    w: 18,
    h: 14,
    config: {
      src: {
        label: 'عنوان الصورة',
        type: 'input',
        value: 'https://kfm-waiter.oss-cn-zhangjiakou.aliyuncs.com/dvadmin/img/aliyun-02.png',
        placeholder: 'الرجاء الدخولعنوان الصورة',
        rules: [
          {
            required: true,
            message: 'لا يمكن أن تكون فارغة'
          }
        ]
      },
      url: {
        label: 'عنوان القفز',
        type: 'input',
        placeholder: 'الرجاء الدخولعنوان القفز',
        value: 'https://www.aliyun.com/minisite/goods?userCode=jpef8a71&share_source=copy_link',
        rules: [
          {
            required: true,
            message: 'لا يمكن أن تكون فارغة'
          }
        ]
      }
    },
    isResizable: true,
    element: 'dashboardImg',
    moved: false
  },
  {
    i: 'usersActive11',
    x: 0,
    y: 12,
    w: 14,
    h: 24,
    config: {
      color: {
        label: 'لون الخلفية',
        type: 'color',
        value: '',
        placeholder: 'اللون فارغ ويتم تحويل اللون بشكل عشوائي'
      },
      fontColor: {
        label: 'لون الخط',
        type: 'color',
        value: null,
        placeholder: 'يختارلون الخط'
      }
    },
    isResizable: true,
    element: 'usersActive',
    moved: false
  },
  {
    i: 'ver11',
    x: 35,
    y: 36,
    w: 13,
    h: 22,
    config: {
      showHeader: {
        label: 'عرض معلومات الرأس',
        type: 'boot',
        value: true,
        placeholder: 'اللون فارغ ويتم تحويل اللون بشكل عشوائي'
      },
      color: {
        label: 'لون الخلفية',
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'اللون فارغ ويتم تحويل اللون بشكل عشوائي'
      },
      fontColor: {
        label: 'لون الخط',
        type: 'color',
        value: null,
        placeholder: 'يختارلون الخط'
      }
    },
    isResizable: true,
    element: 'ver',
    moved: false
  },
  {
    i: 'loginRegion12',
    x: 0,
    y: 36,
    w: 35,
    h: 22,
    config: {},
    isResizable: true,
    element: 'loginRegion',
    moved: false
  }
]
export default log
