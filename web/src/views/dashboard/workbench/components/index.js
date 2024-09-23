import { markRaw } from 'vue'

const resultComps = {}
const requireComponent = require.context(
  './', // ابحث في الدليل الحالي
  false, // لا تمر عبر مجلد المجلد الفرعي
  /\.vue$/ // مباراة منتظمة بواسطة .vueإنهاء الملف
)
requireComponent.keys().forEach(fileName => {
  const comp = requireComponent(fileName)
  resultComps[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
})
export default markRaw(resultComps)
