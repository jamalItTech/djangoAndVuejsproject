// توفير وظيفة المتداول
// وضع التحسين غير المطلي العالمي

import { throttle } from 'lodash'

// الأحداث المتداول givening handler
function handleMaker (wait) {
  return throttle(e => {
    this.$emit('scroll', {
      x: e.target.scrollLeft,
      y: e.target.scrollTop
    })
  }, wait)
}

export default {
  props: {
    // الأحداث المتداول والفاصل الزمني للتدفق
    scrollDelay: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data () {
    return {
      handleScroll: null
    }
  },
  watch: {
    scrollDelay (val) {
      // إزالة المراقبة القديمة
      this.removeScrollListener()
      // جديد handle طريقة
      this.handleScroll = handleMaker.call(this, val)
      // أضف مراقبة جديدة
      this.addScrollListener()
    }
  },
  methods: {
    // زيادة مراقبة الأحداث
    addScrollListener () {
      if (typeof this.handleScroll !== 'function') {
        // mounted نسمي هذا في دورة الحياةطريقةعندما تدخل الحكم هنا ، سوف تدخل هنا
        this.handleScroll = handleMaker.call(this, this.scrollDelay)
      }
      // إضافة المراقبة
      this.$refs.body.addEventListener('scroll', this.handleScroll)
    },
    // قم بإزالة مراقبة الحدث المتداول
    removeScrollListener () {
      this.$refs.body.removeEventListener('scroll', this.handleScroll)
    },
    // مكالمة خارجيةطريقة العودة أعلى
    scrollToTop () {
      const smoothscroll = () => {
        const body = this.$refs.body
        const currentScroll = body.scrollTop
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll)
          body.scrollTo(0, currentScroll - (currentScroll / 5))
        }
      }
      smoothscroll()
    }
  }
}
