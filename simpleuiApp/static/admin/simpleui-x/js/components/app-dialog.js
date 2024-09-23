Vue.component('app-dialog', {
  template: `
    <el-dialog
      :ref="dialogSettings.dynamicDialogRef"
      :visible.sync="dialogSettings.visible"
      :title="dialogSettings.title"
      :width="dialogSettings.width"
      :height="dialogSettings.height"
      :fullscreen="dialogSettings.fullscreen"
      :custom-class="dialogSettings.customClass"
      :modal="dialogSettings.modal"
      :close-on-click-modal="dialogSettings.closeOnClickModal"
      :close-on-press-escape="dialogSettings.closeOnPressEscape"
      :style="dialogSettings.dialogStyle"
      :top="dialogSettings.top"
      :before-close="handleClose"
      :append-to-body="dialogSettings.appendToBody"
      :modal-append-to-body="dialogSettings.modalAppendToBody"
      :destroy-on-close="dialogSettings.destroyOnClose"
      :center="dialogSettings.center"
      :show-close="dialogSettings.showClose"
      :draggable="dialogSettings.draggable"
      :keyboard="dialogSettings.keyboard"
      @close="handleClose"
      :style="dialogSettings.dailogStyle"
    >
      <!-- Header Content -->
      <template #title>
        <dialog-header
          :header-class="dialogSettings.headerClass"
          :header-style="dialogSettings.headerStyle"
          :header-content="dialogSettings.headerContent"
          :header-actions="dialogSettings.headerActions"
          @header-action="handleHeaderAction"
        ></dialog-header>
      </template>

      <!-- Main Content -->
      <template v-if="dialogSettings.contentType === 'html'">
        <div v-html="dialogSettings.content" :style="dialogSettings.contentStyle"></div>
      </template>
      <template v-else-if="dialogSettings.contentType === 'iframe'">
        <iframe :src="dialogSettings.content" frameborder="0" :style="dialogSettings.contentStyle"></iframe>
      </template>
      <template v-else-if="dialogSettings.contentType === 'text'">
        <p :style="dialogSettings.contentStyle">{{ dialogSettings.content }}</p>
      </template>
      <template v-else-if="dialogSettings.contentType === 'table'">
        <el-table :data="dialogSettings.tableData" :style="dialogSettings.contentStyle">
          <el-table-column
            v-for="column in dialogSettings.tableColumns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
          ></el-table-column>
        </el-table>
      </template>
      <template v-else-if="dialogSettings.contentType === 'form'">
        <el-form :model="dialogSettings.formModel" :rules="dialogSettings.formRules" :style="dialogSettings.contentStyle">
          <el-form-item
            v-for="field in dialogSettings.formFields"
            :key="field.prop"
            :label="field.label"
            :prop="field.prop"
          >
            <el-input v-model="dialogSettings.formModel[field.prop]" :placeholder="field.placeholder"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="dialogSettings.contentType === 'chart'">
        <chart-component :data="dialogSettings.chartData" :options="dialogSettings.chartOptions" :style="dialogSettings.contentStyle"></chart-component>
      </template>
      <template v-else-if="dialogSettings.contentType === 'dynamic'">
        <component :is="dialogSettings.dynamicComponent" :data="dialogSettings.dynamicData" :style="dialogSettings.contentStyle"></component>
      </template>
      <template v-else>
        <div :style="dialogSettings.contentStyle">Unsupported content type</div>
      </template>

      <!-- Footer Content -->
      <template #footer>
        <dialog-footer
          :footer-buttons="dialogSettings.footerButtons"
          :dialog-settings="dialogSettings"
          @button-click="handleFooterButtonClick"
        ></dialog-footer>
      </template>
    </el-dialog>
  `,
  props: {
    dialogSettings: Object
  },
  methods: {
    handleClose(done) {
      if (this.dialogSettings.defaultCloseHandler) {
  this.dialogSettings.visible=false;     
        this.$emit('dialog-close');
      }
      if (typeof done === 'function') {
        done();
      }
    },
    handleHeaderAction(action) {
      if (this.dialogSettings.defaultHeaderActionHandler) {
        this.$emit('header-action', action);
      }
      if (typeof action === 'function') {
        action(); // Call the custom header action function if it's a function
      }
    },
    handleFooterButtonClick(actionName) {

      if (this.dialogSettings.defaultFooterButtonClickHandler) {
        this.$emit('footer-button-click', actionName);
      }
      if (typeof actionName === 'string') {
        if (actionName === 'closeDialog') {
          this.handleClose();
        } else if (actionName === 'reloadContent') {
          this.reloadContent();
        } else {
          console.log('Unknown action:', actionName);
        }
      }
    },
    reloadContent() {
      console.log('Content reloaded');
      // Custom reload content logic
    }
  }
});
