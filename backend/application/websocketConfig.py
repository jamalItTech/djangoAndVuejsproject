# -*- coding: utf-8 -*-
import urllib

from asgiref.sync import sync_to_async, async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer, AsyncWebsocketConsumer
import json

from channels.layers import get_channel_layer
from jwt import InvalidSignatureError
from rest_framework.request import Request

from application import settings

send_dict = {}


# إرسال هيكل الرسالة
def set_message(sender, msg_type, msg, refresh_unread=False):
    text = {
        'sender': sender,
        'contentType': msg_type,
        'content': msg,
        'refresh_unread': refresh_unread
    }
    return text


# عدم التزامن الحصول على مستخدمي مركز الرسائل المستهدف
@database_sync_to_async
def _get_message_center_instance(message_id):
    from dvadmin.system.models import MessageCenter
    _MessageCenter = MessageCenter.objects.filter(id=message_id).values_list('target_user', flat=True)
    if _MessageCenter:
        return _MessageCenter
    else:
        return []


@database_sync_to_async
def _get_message_unread(user_id):
    """عدد الرسائل غير المقروءة للمستخدمين"""
    from dvadmin.system.models import MessageCenterTargetUser
    count = MessageCenterTargetUser.objects.filter(users=user_id, is_read=False).count()
    return count or 0


def request_data(scope):
    query_string = scope.get('query_string', b'').decode('utf-8')
    qs = urllib.parse.parse_qs(query_string)
    return qs


class DvadminWebSocket(AsyncJsonWebsocketConsumer):
    async def connect(self):
        try:
            import jwt
            self.service_uid = self.scope["url_route"]["kwargs"]["service_uid"]
            decoded_result = jwt.decode(self.service_uid, settings.SECRET_KEY, algorithms=["HS256"])
            if decoded_result:
                self.user_id = decoded_result.get('user_id')
                self.room_name = "user_" + str(self.user_id)
                # العلاج عند تلقي الاتصال，
                await self.channel_layer.group_add(
                    "dvadmin",
                    self.channel_name
                )
                await self.channel_layer.group_add(
                    self.room_name,
                    self.channel_name
                )
                await self.accept()
                # دفع الرسالة بنشاط
                unread_count = await _get_message_unread(self.user_id)
                if unread_count == 0:
                    # اتصال ناجح
                    await self.send_json(set_message('system', 'SYSTEM', 'اتصال ناجح'))
                else:
                    await self.send_json(
                        set_message('system', 'SYSTEM', "يرجى الاطلاع~",
                                    refresh_unread=True))
        except InvalidSignatureError:
            await self.disconnect(None)

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        await self.channel_layer.group_discard("dvadmin", self.channel_name)
        print("قم بتوصيل إغلاق")
        try:
            await self.close(close_code)
        except Exception:
            pass


class MegCenter(DvadminWebSocket):
    """
    مركز الرسائل
    """

    async def receive(self, text_data):
        # اقبل معلومات العميل，الوظيفة التي تتعامل معها
        text_data_json = json.loads(text_data)
        # message_id = text_data_json.get('message_id', None)
        # user_list = await _get_message_center_instance(message_id)
        # for send_user in user_list:
        #     await self.channel_layer.group_send(
        #         "user_" + str(send_user),
        #         {'type': 'push.message', 'json': text_data_json}
        #     )

    async def push_message(self, event):
        """إرسال الرسالة"""
        message = event['json']
        await self.send(text_data=json.dumps(message))



def websocket_push(room_name,message):
    """
    دفع بنشاط
    @param room_name: اسم المجموعة
    @param message: محتوى
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        room_name,
        {
            "type": "push.message",
            "json": message
        }
    )
