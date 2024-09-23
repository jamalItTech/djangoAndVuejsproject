<template>
  <div>
    <!-- Render all open dialogs -->
    <el-dialog
      v-for="(dialog, index) in dialogs"
      :key="index"
      :title="dialog.title"
      :visible.sync="dialog.show"
      :before-close="() => handleClose(dialog)"
      :custom-class="dialog.customClass"
      :width="dialog.dialogWidth"
      :height="dialog.dialogHeight"
    >
      <iframe
        ref="contentIframe"
        :src="dialog.url"
        frameborder="0"
      ></iframe>
      <template v-slot:footer>
        <el-button @click="handleCancel(dialog)">Cancel</el-button>
        <el-button type="primary" @click="handleSave(dialog)">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogs: [], // Stack to manage open dialogs
      loading: false,
    };
  },
  methods: {
    openDialog(url, title, customClass = '', dialogWidth = '70vw', dialogHeight = '70vh') {
      const newDialog = {
        url,
        title,
        customClass,
        dialogWidth,
        dialogHeight,
        show: true,
      };

      this.dialogs.push(newDialog);
      // Ensure the content of the new dialog is checked for readiness
      this.$nextTick(() => {
        this.checkContentReady(newDialog);
      });
    },

    checkContentReady(dialog) {
      const iframe = this.$refs.contentIframe;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

      setTimeout(() => {
        const forms = iframeDocument.querySelectorAll('form');
        const tables = iframeDocument.querySelectorAll('table');

        let isContentReady = false;

        if (forms.length > 0) {
          isContentReady = Array.from(forms).every(form => form.querySelectorAll('input, select, textarea').length > 0);
        }

        if (tables.length > 0) {
          isContentReady = Array.from(tables).every(table => table.querySelectorAll('tr').length > 0);
        }

        if (isContentReady) {
          this.calculateDialogSize(dialog); // Update dialog size
          this.loading = false;
        } else {
          this.checkContentReady(dialog); // Retry if not ready
        }
      }, 500); // Retry delay
    },

    calculateDialogSize(dialog) {
      const iframe = this.$refs.contentIframe;
      if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const contentHeight = iframeDocument.body.scrollHeight;
        const contentWidth = iframeDocument.body.scrollWidth;

        const dialogElement = this.$el.querySelector('.el-dialog');
        const dialogHeader = dialogElement.querySelector('.el-dialog__header');
        const dialogBody = dialogElement.querySelector('.el-dialog__body');

        const headerHeight = dialogHeader ? dialogHeader.offsetHeight : 0;
        const bodyPadding = dialogBody ? (
          parseInt(window.getComputedStyle(dialogBody).paddingTop) +
          parseInt(window.getComputedStyle(dialogBody).paddingBottom)
        ) : 0;

        const totalHeight = contentHeight + headerHeight;
        dialog.dialogWidth = contentWidth + 'px';
        dialog.dialogHeight = totalHeight + 'px';

        if (dialogElement) {
          dialogElement.style.setProperty("width", dialog.dialogWidth, "important");
          dialogElement.style.setProperty("height", dialog.dialogHeight, "important");
        }
      }
    },

    handleClose(dialog) {
      // Remove the closed dialog from the stack
      const index = this.dialogs.indexOf(dialog);
      if (index !== -1) {
        this.dialogs.splice(index, 1);
      }

      // Show the previous dialog if there are any left
      this.$nextTick(() => {
        if (this.dialogs.length > 0) {
          this.dialogs[this.dialogs.length - 1].show = true;
        }
      });
    },

    handleSave(dialog) {
      // Handle saving logic
      this.$message({
        message: 'Data saved successfully!',
        type: 'success'
      });
      this.handleClose(dialog);
    },

    handleCancel(dialog) {
      this.handleClose(dialog);
    }
  }
};
</script>

<style scoped>
.el-dialog {
  /* Custom styles for dialogs if needed */
}
</style>
