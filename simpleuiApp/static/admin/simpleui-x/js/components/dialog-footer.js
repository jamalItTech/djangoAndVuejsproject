Vue.component('dialog-footer', {
  props: {
    footerButtons: {
      type: Array,
      required: true
    },
    dialogSettings: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleButtonClick(action) {
      console.log("dddddddddd",action)

      if (typeof action === 'function') {
        action(); // Execute the custom action function
      } else {
        this.$emit('button-click', action); // Emit the action
      }
    }
  },
  template: `
    <div :style="dialogSettings.footerStyle" class="dialog-footer">
      <el-button
        v-for="button in footerButtons"
        :key="button.label"
        :type="button.type || 'default'"
        @click="handleButtonClick(button.actionName)"
      >
        {{ button.label }}
      </el-button>
    </div>
  `
});
