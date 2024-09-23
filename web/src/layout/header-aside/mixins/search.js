import { mapState, mapMutations } from 'vuex'

import hotkeys from 'hotkeys-js'

export default {
  components: {
    'd2-panel-search': () => import('../components/panel-search')
  },
  mounted () {
    // ربط مفاتيح اختصار وظيفة البحث [ يفتح ]
    hotkeys(this.searchHotkey.open, event => {
      event.preventDefault()
      this.searchPanelOpen()
    })
    // ربط مفاتيح اختصار وظيفة البحث [ إنهاء ]
    hotkeys(this.searchHotkey.close, event => {
      event.preventDefault()
      this.searchPanelClose()
    })
  },
  beforeDestroy () {
    hotkeys.unbind(this.searchHotkey.open)
    hotkeys.unbind(this.searchHotkey.close)
  },
  computed: {
    ...mapState('d2admin', {
      searchActive: state => state.search.active,
      searchHotkey: state => state.search.hotkey
    })
  },
  methods: {
    ...mapMutations({
      searchToggle: 'd2admin/search/toggle',
      searchSet: 'd2admin/search/set'
    }),
    /**
     * تلقي زر البحث انقر فوق
     */
    handleSearchClick () {
      this.searchToggle()
      if (this.searchActive) {
        setTimeout(() => {
          if (this.$refs.panelSearch) {
            this.$refs.panelSearch.focus()
          }
        }, 500)
      }
    },
    searchPanelOpen () {
      if (!this.searchActive) {
        this.searchSet(true)
        setTimeout(() => {
          if (this.$refs.panelSearch) {
            this.$refs.panelSearch.focus()
          }
        }, 500)
      }
    },
    // إنهاءلوحة البحث
    searchPanelClose () {
      if (this.searchActive) {
        this.searchSet(false)
      }
    }
  }
}
