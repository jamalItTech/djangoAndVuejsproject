export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      // tableType: 'vxe-table',
      // rowKey: true, // يجب تعيين，true or false
      rowId: 'id',
      height: '100%', // ارتفاع100%, يستخدمtoolbarيجب تعيين
      highlightCurrentRow: false
    },
    rowHandle: {
      fixed: 'right',
      view: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Retrieve')
        }
      },
      width: 70,
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
        text: 'يمسح',
        show: false,
        disabled () {
          return !vm.hasPermissions('Delete')
        }
      }
    },
    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      disabled: true,
      defaultSpan: 12 // النموذج الافتراضي span
    },
    indexRow: { // أو تمر مباشرةtrue,لا تعرضtitle，غير شعبية
      title: 'رقم سري',
      align: 'center',
      width: 70
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
          show: false,
          component: {
            placeholder: 'الرجاء الدخولالكلمة الرئيسية'
          }
        }
      },
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
        title: 'تسجيل الدخول اسم المستخدم',
        key: 'username',
        search: {
          disabled: false
        },
        width: 140,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: 'الرجاء الدخولتسجيل الدخول اسم المستخدم'
          }
        }
      },
      {
        title: 'تسجيل الدخولip',
        key: 'ip',
        search: {
          disabled: false
        },
        width: 130,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: 'الرجاء الدخولتسجيل الدخولip'
          }
        }
      }, {
        title: 'المشغل',
        key: 'isp',
        search: {
          disabled: true
        },
        disabled: true,
        width: 180,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولالمشغل'
          }
        }
      }, {
        title: 'دازو',
        key: 'continent',
        width: 80,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: 'الرجاء الدخولدازو'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'أمة',
        key: 'country',
        width: 80,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولأمة'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'مقاطعة',
        key: 'province',
        width: 80,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولمقاطعة'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'مدينة',
        key: 'city',
        width: 80,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولمدينة'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'مقاطعة',
        key: 'district',
        width: 80,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولمقاطعة'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'الكود الإقليمي',
        key: 'area_code',
        width: 100,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولالكود الإقليمي'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'الاسم الإنجليزي الكامل',
        key: 'country_english',
        width: 120,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولالاسم الإنجليزي الكامل'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'اختصار',
        key: 'country_code',
        width: 100,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولاختصار'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'خط الطول',
        key: 'longitude',
        width: 80,
        type: 'input',
        disabled: true,
        form: {
          component: {
            placeholder: 'الرجاء الدخولخط الطول'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'خط العرض',
        key: 'latitude',
        width: 80,
        type: 'input',
        disabled: true,
        form: {
          component: {
            placeholder: 'الرجاء الدخولخط العرض'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'تسجيل الدخوليكتب',
        key: 'login_type',
        width: 100,
        type: 'select',
        search: {
          disabled: false
        },
        dict: {
          data: [
            { label: 'عاديتسجيل الدخول', value: 1 },
            { label: 'عادي扫码تسجيل الدخول', value: 2 },
            { label: 'رمز مسح WeChatتسجيل الدخول', value: 3 },
            { label: 'رمز مسح الكتب الطائرتسجيل الدخول', value: 4 },
            { label: 'رمز تسميرتسجيل الدخول', value: 5 },
            { label: 'رسالة قصيرةتسجيل الدخول', value: 6 }]
        },
        form: {
          component: {
            placeholder: 'يختارتسجيل الدخوليكتب'
          }
        },
        component: { props: { color: 'auto' } } // الصباغة التلقائية
      }, {
        title: 'نظام التشغيل',
        key: 'os',
        width: 180,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولنظام التشغيل'
          }
        }
      }, {
        title: 'اسم المتصفح',
        key: 'browser',
        width: 180,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولاسم المتصفح'
          }
        }
      }, {
        title: 'agentمعلومة',
        key: 'agent',
        disabled: true,
        width: 180,
        type: 'input',
        form: {
          component: {
            placeholder: 'الرجاء الدخولagentمعلومة'
          }
        }
      }, {
        fixed: 'right',
        title: 'تسجيل الدخولوقت',
        key: 'create_datetime',
        width: 160,
        type: 'datetime',
        sortable: true
      }
    ]
  }
}
