const log = {}

/**
 * @description العودة إلى هذا النمط من قيمة اللون
 * @param {String} type اسم النمط [ primary | success | warning | danger | text ]
 */
function typeColor (type = 'default') {
  let color = ''
  switch (type) {
    case 'default': color = '#35495E'; break
    case 'primary': color = '#3488ff'; break
    case 'success': color = '#43B883'; break
    case 'warning': color = '#e6a23c'; break
    case 'danger': color = '#f56c6c'; break
    default:; break
  }
  return color
}

/**
 * @description واحد [ title | text ] نمط المعلومات
 * @param {String} title title text
 * @param {String} info info text
 * @param {String} type style
 */
log.capsule = function (title, info, type = 'primary') {
  console.log(
    `%c ${title} %c ${info} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  )
}

/**
 * @description طباعة نص اللون
 */
log.colorful = function (textArr) {
  console.log(
    `%c${textArr.map(t => t.text || '').join('%c')}`,
    ...textArr.map(t => `color: ${typeColor(t.type)};`)
  )
}

/**
 * @description مطبعة default نص النمط
 */
log.default = function (text) {
  log.colorful([{ text }])
}

/**
 * @description مطبعة primary نص النمط
 */
log.primary = function (text) {
  log.colorful([{ text, type: 'primary' }])
}

/**
 * @description مطبعة success نص النمط
 */
log.success = function (text) {
  log.colorful([{ text, type: 'success' }])
}

/**
 * @description مطبعة warning نص النمط
 */
log.warning = function (text) {
  log.colorful([{ text, type: 'warning' }])
}

/**
 * @description مطبعة danger نص النمط
 */
log.danger = function (text) {
  log.colorful([{ text, type: 'danger' }])
}

export default log
