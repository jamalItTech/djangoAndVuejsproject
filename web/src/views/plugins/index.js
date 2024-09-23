import Vue from 'vue'

function importAll (r) {
  const __modules = []
  r.keys().forEach(key => {
    if (!key.match(new RegExp('^test_.*$')) && key.split('/').length >= 3) {
      __modules.push(key.split('/')[1])
    }
  })
  return __modules
}

export const checkPlugins = function install (pluginName) {
  let pluginsList
  pluginsList = importAll(require.context('./', true, /index\.js$/))
  if (pluginsList && pluginsList.indexOf(pluginName) !== -1) {
    try {
      const Module = import('@/views/plugins/' + pluginName + '/src/index')
      // مكون مسجل
      if (Module.default) {
        Vue.use(Module.default)
      }
      // المكونات المحلية -في
      return 'local'
    } catch (exception) {}
  }
  pluginsList = importAll(require.context('@great-dream/', true, /index\.js$/))
  if (pluginsList && pluginsList.indexOf(pluginName) !== -1) {
    // node_modules قابس التغليف
    try {
      const Module = import('@great-dream/' + pluginName + '/src/index')
      // مكون مسجل
      if (Module.default) {
        Vue.use(Module.default)
      }
      // المكونات المحلية -في
      return 'plugins'
    } catch (exception) {}
  }
  // لا يوجد سد
  return undefined
}

export const plugins = async function install (Vue, options) {
  // يجد src/views/plugins الدليل كل المكونات -في，يوجد دليل في المكونات يجب أن يكون متاحًا index.js وثيقة
  // مرة أخرىيجد node_modules/@great-dream/ كل المكونات في الدليل
  // انتعاشvueيسجل
  if (window.pluginsAll) return
  let components = []
  components = components.concat(importAll(require.context('./', true, /index\.js$/)))
  components = components.concat(importAll(require.context('@great-dream/', true, /index\.js$/)))
  components = Array.from(new Set(components))
  components.filter(async (key, index) => {
    try {
      const Module = await import('@/views/plugins/' + key + '/src/index')
      // مكون مسجل
      if (Module.default) {
        Vue.use(Module.default)
        return true
      }
      return false
    } catch (exception) {
      try {
        const Module = await import('@great-dream/' + key + '/src/index')
        // مكون مسجل
        if (Module.default) {
          Vue.use(Module.default)
          return true
        }
        return false
      } catch (exception) {
        console.log(`[${key}]فشل التسجيل في التسجيل:`, exception)
        return false
      }
    }
  })
  console.log('سجل سدادة ناجحة في：', components)
  window.pluginsAll = components
  return components
}

export const getStoreModules = function (Vue, options) {
  // احصل على كل البرنامج المساعدStoreوثيقةوالتسجيل
  if (window.storeModules) return
  const storeModules = {}
  let components = []
  components = components.concat(importAll(require.context('./', true, /index\.js$/)))
  components = components.concat(importAll(require.context('@great-dream/', true, /index\.js$/)))
  components = Array.from(new Set(components))
  components.filter(async (key, index) => {
    try {
      const Module = require('@/views/plugins/' + key + '/src/store/index.js')
      // مكون مسجل
      if (Module.default) {
        storeModules[Module.default.stateName || key] = Module.default
        console.log(`[${key}]storeسجل بنجاح`)
        return true
      }
      return false
    } catch (exception) {
      try {
        const Module = require('@great-dream/' + key + '/src/store/index.js')
        // مكون مسجل
        if (Module.default) {
          storeModules[Module.default.stateName || key] = Module.default
          console.log(`[${key}]storeسجل بنجاح`)
          return true
        }
        return false
      } catch (exception) {
        return false
      }
    }
  })
  window.storeModules = storeModules
  return storeModules
}
