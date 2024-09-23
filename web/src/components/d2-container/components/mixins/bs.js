import BScroll from 'better-scroll'
export default {
  props: {
    // خيار التحسين المتداول
    betterScrollOptions: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data () {
    return {
      BS: null
    }
  },
  mounted () {
    this.scrollInit()
  },
  beforeDestroy () {
    this.scrollDestroy()
  },
  methods: {
    scrollInit () {
      // التهيئة bs
      this.BS = new BScroll(this.$refs.wrapper, Object.assign({
        mouseWheel: true,
        click: true,
        scrollbar: {
          fade: true,
          interactive: false
        }
      }, this.betterScrollOptions))
      // الحدث عند المتداول وعاد تنسيق البيانات بشكل موحد
      this.BS.on('scroll', ({ x, y }) => this.$emit('scroll', {
        x: -x,
        y: -y
      }))
    },
    scrollDestroy () {
      // https://github.com/d2-projects/d2-admin/issues/75
      try {
        this.BS.destroy()
      } catch (e) {
        delete this.BS
        this.BS = null
      }
    },
    // طريقة الاتصال الخارجية العودة أعلى
    scrollToTop () {
      if (this.BS) this.BS.scrollTo(0, 0, 300)
    },
    // إصدار أحداث متداول يدويًا
    scroll () {
      if (this.BS) {
        this.$emit('scroll', {
          x: -this.BS.x,
          y: -this.BS.y
        })
      }
    }
  }
}
