import { throttle } from 'lodash'
import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { createMenu } from '../libs/util.menu'

export default {
  name: 'd2-layout-header-aside-menu-header',
  mixins: [
    menuMixin
  ],
  render (h) {
    return <div
      flex="cross:center"
      class={ { 'd2-theme-header-menu': true, 'is-scrollable': this.isScroll } }
      ref="page">
      <div
        ref="content"
        class="d2-theme-header-menu__content"
        flex-box="1"
        flex>
        <div
          class="d2-theme-header-menu__scroll"
          flex-box="0"
          style={ { transform: `translateX(${this.currentTranslateX}px)` } }
          ref="scroll">
          <el-menu
            mode="horizontal"
            defaultActive={ this.active }
            onSelect={ this.handleMenuSelect }>
            { this.header.map(menu => createMenu.call(this, h, menu)) }
          </el-menu>
        </div>
      </div>
      {
        this.isScroll
          ? [
            <div
              class="d2-theme-header-menu__prev"
              flex="main:center cross:center"
              flex-box="0"
              onClick={ () => this.scroll('left') }>
              <i class="el-icon-arrow-left"></i>
            </div>,
            <div
              class="d2-theme-header-menu__next"
              flex="main:center cross:center"
              flex-box="0"
              onClick={ () => this.scroll('right') }>
              <i class="el-icon-arrow-right"></i>
            </div>
          ]
          : []
      }
    </div>
  },
  computed: {
    ...mapState('d2admin/menu', [
      'header'
    ])
  },
  data () {
    return {
      active: '',
      isScroll: false,
      scrollWidth: 0,
      contentWidth: 0,
      currentTranslateX: 0,
      throttledCheckScroll: null
    }
  },
  watch: {
    '$route.matched': {
      handler (val) {
        this.active = val[val.length - 1].path
      },
      immediate: true
    }
  },
  methods: {
    scroll (direction) {
      if (direction === 'left') {
        // لفة إلى اليمين
        this.currentTranslateX = 0
      } else {
        // لفة إلى اليسار
        if (this.contentWidth * 2 - this.currentTranslateX <= this.scrollWidth) {
          this.currentTranslateX -= this.contentWidth
        } else {
          this.currentTranslateX = this.contentWidth - this.scrollWidth
        }
      }
    },
    checkScroll () {
      let contentWidth = this.$refs.content.clientWidth
      let scrollWidth = this.$refs.scroll.clientWidth
      if (this.isScroll) {
        // لا يزال مسموحا للصفحة بالتمرير，يجب تحديثهاwidth
        if (this.contentWidth - this.scrollWidth === this.currentTranslateX) {
          // currentTranslateX تحتاج أيضا إلى التغيير وفقا لذلك【عندما تكون الطرف الأيمن للبدء ، الموقف】
          this.currentTranslateX = contentWidth - scrollWidth
          // لا يزال الانزلاق السريع موجودًا عند الحكم على المقابلة وحسابهاcontentWidthتصبح إيجابية，لذلك تحتاج إلى الحد من ذلك
          if (this.currentTranslateX > 0) {
            this.currentTranslateX = 0
          }
        }
        // تحديث بيانات العنصر
        this.contentWidth = contentWidth
        this.scrollWidth = scrollWidth
        // تحديد متى يتم لفة وتختفي: متىscroll > content
        if (contentWidth > scrollWidth) {
          this.isScroll = false
        }
      }
      // تحديد متى يتم لف: متىscroll < content
      if (!this.isScroll && contentWidth < scrollWidth) {
        this.isScroll = true
        // يلاحظ，متىisScrollيصبحtrue，سيتغير حجم مربع العنصر المقابل
        this.$nextTick(() => {
          contentWidth = this.$refs.content.clientWidth
          scrollWidth = this.$refs.scroll.clientWidth
          this.contentWidth = contentWidth
          this.scrollWidth = scrollWidth
          this.currentTranslateX = 0
        })
      }
    }
  },
  mounted () {
    // تهيئة الحكم
    // افتراضي حجم العنصر الأصل والعنصر الطفل，لتحديد ما إذا كان يتم عرض الموقف الأولي
    this.checkScroll()
    // مراقبة تغيير النافذة العالمية，تحديد حجم الوالد والعنصر الطفل，للسيطرةisScrollيُحوّل
    this.throttledCheckScroll = throttle(this.checkScroll, 300)
    window.addEventListener('resize', this.throttledCheckScroll)
  },
  beforeDestroy () {
    // إلغاء المراقبة
    window.removeEventListener('resize', this.throttledCheckScroll)
  }
}
