Vue.component('dialog-header', {
    props: {
      headerClass: String,
      headerStyle: Object,
      headerContent: String,
      headerActions: Array
    },
    methods: {
      handleAction(action) {
        this.$emit('action-click', action);
      }
    },
    template: `
      <div :class="headerClass" :style="headerStyle">
        <span v-html="headerContent"></span>
        <el-button v-if="headerActions.length" @click="handleAction(action)" v-for="action in headerActions" :key="action.label">
          {{ action.label }}
        </el-button>
      </div>
    `
  });
  