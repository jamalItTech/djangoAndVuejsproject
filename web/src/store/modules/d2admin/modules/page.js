import { cloneDeep, uniq, get } from 'lodash'
import router from '@/router'
import setting from '@/setting.js'

// حدد ما إذا كنت بحاجة إلى ذاكرة التخزين المؤقت
const isKeepAlive = data => get(data, 'meta.cache', false)

export default {
  namespaced: true,
  state: {
    // يمكن أن يكون على صفحات متعددة tab الصفحة المعروضة في الوضع
    pool: [],
    // القائمة المتعددة الصفحات المعروضة حاليًا
    opened: get(setting, 'page.opened', []),
    // تم تحميل بيانات TAB المتعددة https://github.com/d2-projects/d2-admin/issues/201
    openedLoaded: false,
    // الصفحة الحالية
    current: '',
    // الصفحات التي تحتاج إلى ذاكرة التخزين المؤقت name
    keepAlive: []
  },
  actions: {
    /**
     * @description يتأكدتم تحميل بيانات TAB المتعددة https://github.com/d2-projects/d2-admin/issues/201
     * @param {Object} context
     */
    isLoaded ({ state }) {
      if (state.openedLoaded) return Promise.resolve()
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (state.openedLoaded) resolve(clearInterval(timer))
        }, 10)
      })
    },
    /**
     * @class opened
     * @description التحميل من قائمة صفحة تبويب تحميل البيانات المستمرة
     * @param {Object} context
     */
    async openedLoad ({ state, commit, dispatch }) {
      // store تكليف
      const value = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'page.opened',
        defaultValue: setting.page.opened,
        user: true
      }, { root: true })
      // تحسين البيانات في وظائف المعالجة قم بتصفية العلامة التي فشلت الآن أو غيرت معلومات المعلومات
      // بواسطة fullPath الحقول سائدة
      // إذا كان هناك الكثير من الصفحات ، فقد تحتاج إلى تحسين الخوارزمية
      // valid قائمة صالحة 1, 1, 0, 1 => فعال, فعال, يفشل, فعال
      const valid = []
      // بيانات العملية
      state.opened = value
        .map(opened => {
          // تجاهل وحدة التحكم
          if (opened.fullPath === '/index') {
            valid.push(1)
            return opened
          }
          // حاول أن تجد في جميع صفحات جميع صفحات الدعم المتعددة TAB name صفحة مطابقة
          const find = state.pool.find(item => item.name === opened.name)
          // سِجِلّفعالأو معلومات غير صالحة
          valid.push(find ? 1 : 0)
          // البيانات بعد الاندماج غطى حديثًا القديم
          // البيانات الجديدة عمومًا لا تحمل params و query, مكانبواسطةستبقى المعلمات القديمة
          return Object.assign({}, opened, find)
        })
        .filter((opened, index) => valid[index] === 1)
      // علامةتم تحميل بيانات TAB المتعددة https://github.com/d2-projects/d2-admin/issues/201
      state.openedLoaded = true
      // وفق opened إعدادات ذاكرة التخزين المؤقت لتوليد البيانات
      commit('keepAliveRefresh')
    },
    /**
     * سوف opened ملكيةتكليفومتينة قبل ذلك ، يرجى التأكد من تحديثك state.opened
     * @param {Object} context
     */
    async opened2db ({ state, dispatch }) {
      // تعيين البيانات
      dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'page.opened',
        value: state.opened,
        user: true
      }, { root: true })
    },
    /**
     * @class opened
     * @description قم بتحديث عنصر معين في قائمة الصفحات
     * @param {Object} context
     * @param {Object} payload { index, params, query, fullPath } معلومات المسار
     */
    async openedUpdate ({ state, commit, dispatch }, { index, params, query, fullPath }) {
      // تحديث قائمة الصفحة
      const page = state.opened[index]
      page.params = params || page.params
      page.query = query || page.query
      page.fullPath = fullPath || page.fullPath
      state.opened.splice(index, 1, page)
      // متينة
      await dispatch('opened2db')
    },
    /**
     * @class opened
     * @description إعادة -قائمة الصفحات الحصرية
     * @param {Object} context
     * @param {Object} payload { oldIndex, newIndex } معلومات الموقع
     */
    async openedSort ({ state, commit, dispatch }, { oldIndex, newIndex }) {
      // إعادة -قائمة الصفحات الحصرية
      const page = state.opened[oldIndex]
      state.opened.splice(oldIndex, 1)
      state.opened.splice(newIndex, 0, page)
      // متينة
      await dispatch('opened2db')
    },
    /**
     * @class opened
     * @description واحد جديد tag (افتح صفحة)
     * @param {Object} context
     * @param {Object} payload new tag info
     */
    async add ({ state, commit, dispatch }, { tag, params, query, fullPath }) {
      // تعيين جديد tag افتح واحدة في الجديدبواسطةاستخدم عندما لم تفتح الصفحة من قبل
      const newTag = tag
      newTag.params = params || newTag.params
      newTag.query = query || newTag.query
      newTag.fullPath = fullPath || newTag.fullPath
      // أضف إلى صفيف الصفحة المعروض حاليًا
      state.opened.push(newTag)
      // إذا كانت هذه الصفحة تحتاج إلى ذاكرة التخزين المؤقت سوفيضيف إلى إعدادات ذاكرة التخزين المؤقت
      if (isKeepAlive(newTag)) commit('keepAlivePush', tag.name)
      // متينة
      await dispatch('opened2db')
    },
    /**
     * @class current
     * @description افتح صفحة جديدة
     * @param {Object} context
     * @param {Object} payload خطاف التوجيه to هدف { name, params, query, fullPath, meta } معلومات المسار
     */
    async open ({ state, commit, dispatch }, { name, params, query, fullPath, meta }) {
      // الصفحة التي تم فتحها
      const opened = state.opened
      // تحديد ما إذا كان قد تم فتح هذه الصفحة سجل الموقع
      let pageOpendIndex = 0
      const pageOpend = opened.find((page, index) => {
        const same = page.fullPath === fullPath
        pageOpendIndex = same ? index : pageOpendIndex
        return same
      })
      if (pageOpend) {
        // صفحةبواسطةيفتح
        await dispatch('openedUpdate', {
          index: pageOpendIndex,
          params,
          query,
          fullPath
        })
      } else {
        // صفحةبواسطةلم يفتح من قبل
        const page = state.pool.find(t => t.name === name)
        // إذا لم يتم العثور عليها هنا page على الرغم من أن هذا التوجيه في الإطار ولكن لا تشارك في عرض صفحة علامة التبويب
        if (page) {
          await dispatch('add', {
            tag: Object.assign({}, page),
            params,
            query,
            fullPath
          })
        }
      }
      // إذا كانت هذه الصفحة تحتاج إلى ذاكرة التخزين المؤقت سوفيضيف إلى إعدادات ذاكرة التخزين المؤقت
      if (isKeepAlive({ meta })) commit('keepAlivePush', name)
      // اضبط الصفحة الحالية
      commit('currentSet', fullPath)
    },
    /**
     * @class opened
     * @description أغلق واحد tag (أغلق واحدصفحة)
     * @param {Object} context
     * @param {Object} payload { tagName: اسم العلامة المراد إغلاقه }
     */
    async close ({ state, commit, dispatch }, { tagName }) {
      // حجز الصفحة الجديدة التالية
      let newPage = {}
      const isCurrent = state.current === tagName
      // إذا كانت الصفحة الإغلاق هي الصفحة المعروضة حاليًا
      if (isCurrent) {
        // اذهب ابحث عن صفحة جديدة
        const len = state.opened.length
        for (let i = 0; i < len; i++) {
          if (state.opened[i].fullPath === tagName) {
            newPage = i < len - 1 ? state.opened[i + 1] : state.opened[i - 1]
            break
          }
        }
      }
      // ابحث عن هذه الصفحة في البيانات التي تم فتحها
      const index = state.opened.findIndex(page => page.fullPath === tagName)
      if (index >= 0) {
        // إذا كانت هذه الصفحة صفحة ذاكرة التخزين المؤقت سوفيحذف في إعدادات ذاكرة التخزين المؤقت
        commit('keepAliveRemove', state.opened[index].name)
        // تحديث البيانات حذف صفحة الإغلاق
        state.opened.splice(index, 1)
      }
      // متينة
      await dispatch('opened2db')
      // الصفحة لتحديد الإقامة الأخيرة
      if (isCurrent) {
        const { name = 'index', params = {}, query = {} } = newPage
        const routerObj = { name, params, query }
        await router.push(routerObj)
      }
    },
    /**
     * @class opened
     * @description قم بإيقاف تشغيل الملصق على الجانب الأيسر من العلامة الحالية
     * @param {Object} context
     * @param {Object} payload { pageSelect: تم اختياره حاليًاtagName }
     */
    async closeLeft ({ state, commit, dispatch }, { pageSelect } = {}) {
      const pageAim = pageSelect || state.current
      let currentIndex = 0
      state.opened.forEach((page, index) => {
        if (page.fullPath === pageAim) currentIndex = index
      })
      if (currentIndex > 0) {
        // حذف الصفحة المفتوحة حذف في إعدادات ذاكرة التخزين المؤقت
        for (let i = state.opened.length - 1; i >= 0; i--) {
          if (state.opened[i].name === 'index' || i >= currentIndex) {
            continue
          }

          commit('keepAliveRemove', state.opened[i].name)
          state.opened.splice(i, 1)
        }
      }
      // متينة
      await dispatch('opened2db')
      // اضبط الصفحة الحالية
      state.current = pageAim
      if (router.app.$route.fullPath !== pageAim) await router.push(pageAim)
    },
    /**
     * @class opened
     * @description قم بإيقاف تشغيل الملصق على الجانب الأيمن من العلامة الحالية
     * @param {Object} context
     * @param {Object} payload { pageSelect: تم اختياره حاليًاtagName }
     */
    async closeRight ({ state, commit, dispatch }, { pageSelect } = {}) {
      const pageAim = pageSelect || state.current
      let currentIndex = 0
      state.opened.forEach((page, index) => {
        if (page.fullPath === pageAim) currentIndex = index
      })
      // حذف الصفحة المفتوحة حذف في إعدادات ذاكرة التخزين المؤقت
      for (let i = state.opened.length - 1; i >= 0; i--) {
        if (state.opened[i].name === 'index' || currentIndex >= i) {
          continue
        }

        commit('keepAliveRemove', state.opened[i].name)
        state.opened.splice(i, 1)
      }
      // متينة
      await dispatch('opened2db')
      // اضبط الصفحة الحالية
      state.current = pageAim
      if (router.app.$route.fullPath !== pageAim) await router.push(pageAim)
    },
    /**
     * @class opened
     * @description أغلق التنشيط الحالي tag
     * @param {Object} context
     * @param {Object} payload { pageSelect: تم اختياره حاليًاtagName }
     */
    async closeOther ({ state, commit, dispatch }, { pageSelect } = {}) {
      const pageAim = pageSelect || state.current
      let currentIndex = 0
      state.opened.forEach((page, index) => {
        if (page.fullPath === pageAim) currentIndex = index
      })
      // حذف الصفحة المفتوحةبيانات وتحديث إعداد ذاكرة التخزين المؤقت
      for (let i = state.opened.length - 1; i >= 0; i--) {
        if (state.opened[i].name === 'index' || currentIndex === i) {
          continue
        }

        commit('keepAliveRemove', state.opened[i].name)
        state.opened.splice(i, 1)
      }
      // متينة
      await dispatch('opened2db')
      // تعيين جديدصفحة
      state.current = pageAim
      if (router.app.$route.fullPath !== pageAim) await router.push(pageAim)
    },
    /**
     * @class opened
     * @description أغلق كل شيء tag
     * @param {Object} context
     */
    async closeAll ({ state, commit, dispatch }) {
      // حذف الصفحة المفتوحة حذف في إعدادات ذاكرة التخزين المؤقت
      for (let i = state.opened.length - 1; i >= 0; i--) {
        if (state.opened[i].name === 'index') {
          continue
        }

        commit('keepAliveRemove', state.opened[i].name)
        state.opened.splice(i, 1)
      }
      // متينة
      await dispatch('opened2db')
      // أغلق كل شيءبعد علامة التبويب ، تحتاج إلى الحكم على ما إذا كان على الصفحة الرئيسية الآن
      if (router.app.$route.name !== 'index') {
        await router.push({ name: 'index' })
      }
    }
  },
  mutations: {
    /**
     * @class keepAlive
     * @description منالصفحة التي تم فتحهاسِجِلّ中更新الصفحات التي تحتاج إلى ذاكرة التخزين المؤقتسِجِلّ
     * @param {Object} state state
     */
    keepAliveRefresh (state) {
      state.keepAlive = state.opened.filter(item => isKeepAlive(item)).map(e => e.name)
    },
    /**
     * @description حذف إعدادات ذاكرة التخزين المؤقت للصفحة
     * @param {Object} state state
     * @param {String} name name
     */
    keepAliveRemove (state, name) {
      const list = cloneDeep(state.keepAlive)
      const index = list.findIndex(item => item === name)
      if (index !== -1) {
        list.splice(index, 1)
        state.keepAlive = list
      }
    },
    /**
     * @description أضف إعدادات ذاكرة التخزين المؤقت للصفحة
     * @param {Object} state state
     * @param {String} name name
     */
    keepAlivePush (state, name) {
      const keep = cloneDeep(state.keepAlive)
      keep.push(name)
      state.keepAlive = uniq(keep)
    },
    /**
     * @description مسح إعدادات ذاكرة التخزين المؤقت للصفحة
     * @param {Object} state state
     */
    keepAliveClean (state) {
      state.keepAlive = []
    },
    /**
     * @class current
     * @description اضبط الصفحة المنشطة الحالية fullPath
     * @param {Object} state state
     * @param {String} fullPath new fullPath
     */
    currentSet (state, fullPath) {
      state.current = fullPath
    },
    /**
     * @class pool
     * @description يحفظ pool (تجمع المرشح)
     * @param {Object} state state
     * @param {Array} routes routes
     */
    init (state, routes) {
      const pool = []
      const push = function (routes) {
        routes.forEach(route => {
          if (route.children && route.children.length > 0) {
            push(route.children)
          } else {
            if (!route.hidden) {
              const { meta, name, path } = route
              pool.push({ meta, name, path })
            }
          }
        })
      }
      push(routes)
      state.pool = pool
    }
  }
}
