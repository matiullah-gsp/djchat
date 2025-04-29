from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from urllib.parse import parse_qs

# Consumer handle coming messages and outgoing messages
# class WebChatConsumer(JsonWebsocketConsumer):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         print("--------------------------------------")
#         print("WebChatConsumer initialized", args, kwargs)
#         print("--------------------------------------")
#         self.channel_id = "testserver"

#     def connect(self):
#         self.accept()

#         print("--------------------------------------")
#         print("Connected to server:", self.channel_id, self.channel_name)
#         print("--------------------------------------")
#         async_to_sync(self.channel_layer.group_add)(self.channel_id, self.channel_name)

#     def receive_json(self, content=None, bytes_data=None):
#         try:
#             print("--------------------------------------")
#             print("Received message:", content)
#             print("--------------------------------------")
#             async_to_sync(self.channel_layer.group_send)(
#                 self.channel_id, {"type": "chat_message", "message": content["message"]}
#             )
#         except Exception as e:
#             print("Error in receive_json:", str(e))
#             self.close()

#     def chat_message(self, event):
#         print("--------------------------------------")
#         print("Sending message:", event)
#         print("--------------------------------------")
#         try:
#             self.send_json(event)
#         except Exception as e:
#             print("Error in send_json:", str(e))
#             self.close()

#     def disconnect(self, close_code):
#         pass


from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Message, Conversation
from django.contrib.auth import get_user_model

User = get_user_model()


class WebChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.channel_name = None
        self.user = None

    def connect(self):
        self.accept()
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            self.close(code=4001)
            return
        self.channel_id = self.scope["url_route"]["kwargs"]["channel_id"]
        async_to_sync(self.channel_layer.group_add)(self.channel_id, self.channel_name)

    def receive_json(self, content):
        try:
            channel_id = self.channel_id
            sender = self.user
            content = content["content"]
            conversation, created = Conversation.objects.get_or_create(
                channel_id=channel_id
            )
            new_message = Message.objects.create(
                conversation=conversation,
                sender=sender,
                content=content,
            )
            formatted_message = {
                "id": str(new_message.id),
                "conversation": str(new_message.conversation.id),
                "content": new_message.content,
                "sender": new_message.sender.username,
                "timestamp": new_message.timestamp.isoformat(),
            }
            async_to_sync(self.channel_layer.group_send)(
                channel_id,
                {
                    "type": "chat_message",
                    "message": formatted_message,
                },
            )
        except Exception as e:
            print("Error in receive_json:", str(e))
            self.close()

    def chat_message(self, event):
        print(f"Sending message: {event['message']}")
        try:
            self.send_json(event)
        except Exception as e:
            print("Error in send_json:", str(e))
            self.close()

    def disconnect(self, close_code):
        if self.channel_id and self.channel_name:
            async_to_sync(self.channel_layer.group_discard)(
                self.channel_id, self.channel_name
            )
        super().disconnect(close_code)
