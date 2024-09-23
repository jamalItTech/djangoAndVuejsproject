// عنصر
import d2ContainerFull from './components/d2-container-full.vue'
import d2ContainerFullBs from './components/d2-container-full-bs.vue'
import d2ContainerGhost from './components/d2-container-ghost.vue'
import d2ContainerGhostBs from './components/d2-container-ghost-bs.vue'
import d2ContainerCard from './components/d2-container-card.vue'
import d2ContainerCardBs from './components/d2-container-card-bs.vue'
import d2Source from './components/d2-source.vue'

export default {
  name: 'd2-container',
  props: {
    // حاوية
    type: {
      type: String,
      required: false,
      default: 'full'
    },
    // التحسين المتداول
    betterScroll: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    // العودة دائما إلى التقديمعنصر
    component () {
      if (this.type === 'card' && !this.betterScroll) return d2ContainerCard
      if (this.type === 'card' && this.betterScroll) return d2ContainerCardBs
      if (this.type === 'ghost' && !this.betterScroll) return d2ContainerGhost
      if (this.type === 'ghost' && this.betterScroll) return d2ContainerGhostBs
      if (this.type === 'full' && !this.betterScroll) return d2ContainerFull
      if (this.type === 'full' && this.betterScroll) return d2ContainerFullBs
      else {
        return 'div'
      }
    }
  },
  render (h) {
    const slots = [
      this.$slots.default,
      this.$slots.header ? <template slot="header">{ this.$slots.header }</template> : null,
      this.$slots.footer ? <template slot="footer">{ this.$slots.footer }</template> : null
    ]
    return <div
      ref="container"
      class="container-component">
      <this.component
        ref="component"
        { ...{ attrs: this.$attrs } }
        onScroll={ e => this.$emit('scroll', e) }>
        { slots }
      </this.component>
      <d2Source/>
    </div>
  },
  methods: {
    // العودة أعلى
    scrollToTop () {
      this.$refs.component.scrollToTop()
      // إذا تم تشغيله better scroll كما يجب تشغيلها يدويًا scroll حدث
      const bs = this.$refs.component.BS
      if (bs) this.$refs.component.scroll()
    },
    // الاستخدام هو نفس الطريقة الأصلية scrollBy
    scrollBy (x = 0, y = 0, time = 300) {
      if (this.betterScroll) {
        const bs = this.$refs.component.BS
        if (bs) {
          bs.scrollBy(-x, -y, time)
          // يدويه يدويًا مرة أخرى scroll حدث
          this.$refs.component.scroll()
        }
      } else {
        this.$refs.component.$refs.body.scrollBy(x, y)
      }
    },
    // الاستخدام هو نفس الطريقة الأصلية scrollTo
    scrollTo (x = 0, y = 0, time = 300) {
      if (this.betterScroll) {
        const bs = this.$refs.component.BS
        if (bs) {
          bs.scrollTo(-x, -y, time)
          // يدويه يدويًا مرة أخرى scroll حدث
          this.$refs.component.scroll()
        }
      } else {
        this.$refs.component.$refs.body.scrollTo(x, y)
      }
    },
    // الاستخدام هو نفس الطريقة الأصلية scrollTop
    scrollTop (top = 0, time = 300) {
      if (this.betterScroll) {
        const bs = this.$refs.component.BS
        if (bs) {
          bs.scrollTo(bs.x, -top, time)
          // يدويه يدويًا مرة أخرى scroll حدث
          this.$refs.component.scroll()
        }
      } else {
        this.$refs.component.$refs.body.scrollTop = top
      }
    }
  }
}
