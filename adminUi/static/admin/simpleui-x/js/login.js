var loginApp = new Vue({
    el: '.login-main',
    data: {
        username: '',
        password: '',
        fiscalYear: '2023', // Set the default fiscal year value
        unit: 'B', // Set the default unit value
        loading: false,
        rules: {
            username: [
                { required: true, message: 'Please enter your username', trigger: 'blur' },
            ],
            password: [
                { required: true, message: 'Please enter your password', trigger: 'blur' },
            ]
        },
        errors: []
    },
    methods: {
        login: function () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.removeWarning(); // Remove warning if validation is successful
                    this.submitForm();
                } else {
                    this.$message.error("Please correct the errors before submitting.");
                    this.triggerWarning(); // Trigger warning if validation fails
                }
            });
        },
        submitForm: function () {
            const formData = new FormData();
            formData.append('username', this.username);
            formData.append('password', this.password);
            
            fetch('/admin/login/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const errorElements = doc.querySelectorAll('el-alert');
                const errors = [];
                errorElements.forEach(element => {
                    errors.push(element.getAttribute('title'));
                });
        
                if (errors.length > 0) {
                    this.errors = errors;
                    this.displayErrors(); // Display errors with notifications
                } else {
                    const redirectUrl = '/admin/';
                    window.location.href = redirectUrl;
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                this.$notify.error({
                    title: 'Error',
                    message: "An unexpected error occurred: " + error.message,
                    duration: 5000, // Display duration in milliseconds
                    customClass: 'notification-error', // Apply custom styles
                });
                this.triggerWarning(); // Trigger warning
            });
        },
        displayErrors: function () {
            this.$nextTick(() => {
                if (this.errors && this.errors.length > 0) {
                    this.errors.forEach((error) => {
                        this.$notify.error({
                            title: 'خطأ',
                            message: error,
                            duration: 5000, // مدة عرض الرسالة 5 ثواني
                            customClass: 'notification-error', // تطبيق أنماط مخصصة
                        });
                    });
                }
            });
        },
        
        triggerWarning: function () {
            const formElement = document.querySelector('.login-main');
            if (formElement) {
                formElement.classList.add('warning-border'); // إضافة الإطار التحذيري المتحرك
            }
        },
        removeWarning: function () {
            const formElement = document.querySelector('.login-main');
            if (formElement) {
                formElement.classList.remove('warning-border'); // إزالة الإطار التحذيري المتحرك
            }
        }
    }
});
