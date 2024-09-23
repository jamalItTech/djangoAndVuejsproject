export const BUTTON_VALUE_TO_COLOR_MAPPING = {
  1: 'success',
  true: 'success',
  0: 'danger',
  false: 'danger',
  Search: 'warning', // استفسار
  Update: 'primary', // يحرر
  Create: 'success', // يزيد
  Retrieve: 'info', // مثال واحد
  Delete: 'danger' // يمسح
}

export function getButtonSettings (objectSettings) {
  return objectSettings.map(item => {
    return {
      label: item.label,
      value: item.value,
      color: BUTTON_VALUE_TO_COLOR_MAPPING[item.value]
    }
  })
}
// v2.0.2 ينبذ，التغيير إلى vm.dictionary('button_status_bool')
// فتح true/ إبطال false
export const BUTTON_STATUS_BOOL = getButtonSettings([{ label: 'فتح', value: true }, { label: 'إبطال', value: false }])

// فتح 1/ إبطال 0
export const BUTTON_STATUS_NUMBER = getButtonSettings([{ label: 'فتح', value: 1 }, { label: 'إبطال', value: 0 }])

// نعم 1/ لا 0
export const BUTTON_WHETHER_NUMBER = getButtonSettings([{ label: 'نعم', value: 1 }, { label: 'لا', value: 0 }])
// نعم true/ لا false
export const BUTTON_WHETHER_BOOL = getButtonSettings([{ label: 'نعم', value: true }, { label: 'لا', value: false }])
// نوع المستخدم
export const USER_TYPE = getButtonSettings([{ label: 'مستخدمي الخلفية', value: 0 }, { label: 'مستخدمي مكتب الاستقبال', value: 1 }])
