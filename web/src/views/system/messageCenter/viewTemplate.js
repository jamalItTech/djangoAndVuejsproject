export default {
  title: {
    title: 'عنوان',
    key: 'title',
    component: {
      span: 24,
      placeholder: 'الرجاء الدخولعنوان',
      disabled: true
    },
    rules: [
      {
        required: true,
        message: 'يتطلب عنصر'
      }
    ],
    order: 10
  },
  content: {
    title: 'محتوى',
    key: 'content',
    component: {
      name: 'd2p-quill',
      span: 24,
      disabled: true,
      props: {
        uploader: {
          type: 'form'
        }
      },
      events: {}
    },
    rules: [
      {
        required: true,
        message: 'يتطلب عنصر'
      }
    ],
    order: 10
  }
}
