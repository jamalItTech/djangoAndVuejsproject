لتنفيذ نظام إدارة الحوارات المتداخلة بشكل متقدم واحترافي يناسب أنظمة ERP، يمكننا استخدام مجموعة من التقنيات التي تضمن أداءً عاليًا وتجربة مستخدم سلسة. الطريقة التي سأقدمها تتضمن استخدام `Vue.js` وإدارة الحوارات كـ "Stack" مع التحكم في `z-index`، وجعل الحوارات قابلة للتحريك، والتحكم في الأحجام بشكل ديناميكي بناءً على المحتوى.

### 1. **إنشاء نظام إدارة الحوارات (Dialog Stack Management)**

يمكنك بناء نظام إدارة الحوارات بحيث يكون لكل حوار هوية فريدة (`ID`) مع إمكانيات مثل جلب الحوار إلى الأمام عند التفاعل معه، وتحريك الحوارات، وتكديسها بشكل هرمي.

#### **أ. إنشاء Stack للحوارات:**

```javascript
export default {
  data() {
    return {
      dialogStack: [], // Stack لتخزين الحوارات المفتوحة
    };
  },
  methods: {
    openDialog(url, title, customClass = '', dialogWidth = 'auto', dialogHeight = 'auto') {
      const dialogId = `dialog-${Date.now()}-${Math.random()}`;
      const zIndex = 2000 + this.dialogStack.length * 10; // تكديس z-index للحوارات

      const newDialog = {
        id: dialogId,
        url,
        title,
        show: true,
        customClass,
        dialogWidth,
        dialogHeight,
        zIndex,
      };

      this.dialogStack.push(newDialog);
      this.$nextTick(() => {
        this.adjustDialogSize(this.dialogStack.length - 1);
      });
    },
    bringToFront(dialogId) {
      const dialogIndex = this.dialogStack.findIndex(dialog => dialog.id === dialogId);
      if (dialogIndex !== -1) {
        const maxZIndex = Math.max(...this.dialogStack.map(dialog => dialog.zIndex));
        this.dialogStack[dialogIndex].zIndex = maxZIndex + 10;
      }
    },
    closeDialog(dialogId) {
      this.dialogStack = this.dialogStack.filter(dialog => dialog.id !== dialogId);
    },
    adjustDialogSize(index) {
      const iframe = this.$refs.contentIframe[index];
      if (!iframe) return;

      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const contentHeight = iframeDocument.body.scrollHeight;
      const contentWidth = iframeDocument.body.scrollWidth;
      const dialog = this.dialogStack[index];

      dialog.dialogWidth = `${contentWidth}px`;
      dialog.dialogHeight = `${contentHeight}px`;

      this.$set(this.dialogStack, index, dialog); // تحديث الحالة في Vue
    },
  },
};
```

### 2. **تهيئة مكون `el-dialog` لإدارة الحوارات المتعددة:**

```html
<el-dialog
  v-for="(dialog, index) in dialogStack"
  :key="dialog.id"
  :title="dialog.title"
  :visible.sync="dialog.show"
  :custom-class="dialog.customClass"
  :style="{ zIndex: dialog.zIndex }"
  :width="dialog.dialogWidth"
  :height="dialog.dialogHeight"
  :before-close="() => closeDialog(dialog.id)"
  @click.native="bringToFront(dialog.id)"
  :draggable="true"  <!-- ميزة السحب لتحريك الحوارات -->
>
  <iframe
    ref="contentIframe"
    :src="dialog.url"
    frameborder="0"
  ></iframe>
  <template v-slot:footer>
    <el-button @click="() => closeDialog(dialog.id)">إلغاء</el-button>
    <el-button type="primary" @click="handleSave">حفظ</el-button>
  </template>
</el-dialog>
```

### 3. **تحسين إدارة الحوارات وضمان التفاعل السلس:**

- **إدارة `z-index`:** تأكد من أن الحوارات يمكن تحريكها في الواجهة وأنها تظهر بشكل صحيح من خلال ضبط `z-index` عند التفاعل مع الحوار.
  
- **السحب وإعادة الترتيب:** يمكن جعل الحوارات قابلة للسحب بحيث يمكن للمستخدمين تحريكها في جميع أنحاء الشاشة. هذا مفيد جدًا في تطبيقات ERP حيث يتم العمل مع نوافذ متعددة في نفس الوقت.

- **تعديل حجم الحوار ديناميكيًا:** بدلاً من تحديد حجم الحوار بشكل ثابت، يمكنك تعديله بناءً على المحتوى، مما يضمن أن الحوار لا يحتوي على مساحات فارغة كبيرة أو يتجاوز حجم الشاشة.

### 4. **ميزة تكديس الحوارات**:

تتيح هذه الطريقة إمكانية فتح حوارات متداخلة حيث يظهر كل حوار فوق الآخر مع إمكانية التحكم في أي حوار هو النشط من خلال التفاعل مع الواجهة.

### 5. **دمج هذه الحلول في نظام ERP**:

من خلال دمج هذه الحلول، يمكنك إنشاء نظام إدارة حوارات ديناميكي وفعال يمكنه التكيف مع الاحتياجات المتزايدة في بيئة عمل ERP. هذه الطريقة تعطي المستخدمين مرونة عالية في العمل مع الحوارات المتعددة وتقدم تجربة مستخدم محسنة.