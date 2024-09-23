import ElementUI from 'element-ui'
import util from '@/libs/util'
import store from '@/store'
function initWebSocket (e) {
  const token = util.cookies.get('token')
  if (token) {
    const wsUri = util.wsBaseURL() + 'ws/' + token + '/'
    this.socket = new WebSocket(wsUri)// داخلthisنقطةvue
    this.socket.onerror = webSocketOnError
    this.socket.onmessage = webSocketOnMessage
    this.socket.onclose = closeWebsocket
  }
}

function webSocketOnError (e) {
  ElementUI.Notification({
    title: '',
    message: 'WebSocketحدث خطأ في الاتصال' + JSON.stringify(e),
    type: 'error',
    position: 'bottom-right',
    duration: 3000
  })
}

/**
 * تلقي رسالة
 * @param e
 * @returns {any}
 */
function webSocketOnMessage (e) {
  const data = JSON.parse(e.data)
  const { refreshUnread, systemConfig } = data
  if (refreshUnread) {
    // تحديث رقم إعلام الرسالة
    store.dispatch('d2admin/messagecenter/setUnread')
  }
  if (systemConfig) {
    // تحديث تكوين النظام
    this.$store.dispatch('d2admin/settings/load')
  }
  if (data.contentType === 'SYSTEM') {
    ElementUI.Notification({
      title: 'رسالة النظام',
      message: data.content,
      type: 'success',
      position: 'bottom-right',
      duration: 3000
    })
  } else if (data.contentType === 'ERROR') {
    ElementUI.Notification({
      title: '',
      message: data.content,
      type: 'error',
      position: 'bottom-right',
      duration: 0
    })
  } else if (data.contentType === 'INFO') {
    ElementUI.Notification({
      title: 'نصائح لطيفة',
      message: data.content,
      type: 'success',
      position: 'bottom-right',
      duration: 0
    })
  } else {
    ElementUI.Notification({
      title: 'نصائح لطيفة',
      message: data.content,
      type: 'info',
      position: 'bottom-right',
      duration: 3000
    })
  }
}
// إنهاءwebsiocket
function closeWebsocket () {
  console.log('اتصالإنهاء...')
  ElementUI.Notification({
    title: 'websocket',
    message: 'اتصالإنهاء...',
    type: 'danger',
    position: 'bottom-right',
    duration: 3000
  })
}

/**
 * أرسل رسالة
 * @param message
 */
function webSocketSend (message) {
  this.socket.send(JSON.stringify(message))
}
export default {
  initWebSocket, closeWebsocket, webSocketSend
}
