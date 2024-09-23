import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    // حالة تنشيط لوحة البحث
    active: false,
    // مفتاح الاختصار
    hotkey: {
      open: setting.hotkey.search.open,
      close: setting.hotkey.search.close
    },
    // جميع الصفحات التي يمكن البحث عنها
    pool: []
  },
  mutations: {
    /**
     * @description تبديل حالة تنشيط
     * @param {Object} state state
     */
    toggle (state) {
      state.active = !state.active
    },
    /**
     * @description اضبط وضع التنشيط
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set (state, active) {
      state.active = active
    },
    /**
     * @description التهيئة
     * @param {Object} state state
     * @param {Array} menu menu
     */
    init (state, menu) {
      const pool = []
      const push = function (menu, titlePrefix = []) {
        menu.forEach(m => {
          if (m.children) {
            push(m.children, [...titlePrefix, m.title])
          } else {
            pool.push({
              ...m,
              fullTitle: [...titlePrefix, m.title].join(' / ')
            })
          }
        })
      }
      push(menu)
      state.pool = pool
    }
  }
}
