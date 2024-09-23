/**
 * تصفية المعلمة الطلب
 *@param that=>this
 *@param array:مجموعة ميدانية أخرى
 */
const filterParams = function (that, array) {
  that.$nextTick(() => {
    const arr = that.crud.columns
    const columnKeys = arr.map(item => {
      return item.key
    })
    let newArray = [...columnKeys, array, 'id']
    newArray = [...new Set(newArray)]
    that.crud.searchOptions.form.query = '{' + newArray.toString() + '}'
  })
}
export default filterParams
