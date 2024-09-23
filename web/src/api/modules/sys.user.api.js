import { find, assign } from 'lodash'

const users = [
  { username: 'admin', password: 'admin', uuid: 'admin-uuid', name: 'Admin' },
  { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: 'Editor' },
  { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: 'User1' }
]

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description تسجيل الدخول
   * @param {Object} data تسجيل الدخولمعلومة
   */
  SYS_USER_LOGIN (data = {}) {
    // بيانات المحاكاة
    mock
      .onAny('/login')
      .reply(config => {
        const user = find(users, tools.parse(config.data))
        return user
          ? tools.responseSuccess(assign({}, user, { token: faker.random.uuid() }))
          : tools.responseError({}, 'الحساب أو كلمة المرور غير صحيحة')
      })
    // طلب واجهة
    return requestForMock({
      url: '/login',
      method: 'post',
      data
    })
  }
})
