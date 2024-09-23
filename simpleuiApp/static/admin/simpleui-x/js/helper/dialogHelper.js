// static/js/dialogHelper.js

(function(window) {
    window.erpFlexDialog = {
        openDialog: function(options) {
            // إرسال رسالة إلى الإطار الأب لفتح حوار
            window.parent.postMessage({ type: 'open-dialog', options: options }, '*');
        }
    };
})(window);
