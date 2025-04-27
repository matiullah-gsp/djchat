from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
import json


# Consumer handle coming messages and outgoing messages
# class WebChatConsumer(JsonWebsocketConsumer):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         print("--------------------------------------")
#         print("WebChatConsumer initialized", args, kwargs)
#         print("--------------------------------------")
#         self.room_name = "testserver"

#     def connect(self):
#         self.accept()

#         print("--------------------------------------")
#         print("Connected to server:", self.room_name, self.channel_name)
#         print("--------------------------------------")
#         async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)

#     def receive_json(self, content=None, bytes_data=None):
#         try:
#             print("--------------------------------------")
#             print("Received message:", content)
#             print("--------------------------------------")
#             async_to_sync(self.channel_layer.group_send)(
#                 self.room_name, {"type": "chat_message", "message": content["message"]}
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


class WebChatConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["channel_id"]
        self.accept()

        print(f"Connected to channel: {self.room_name}")
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )

    def receive_json(self, content):
        try:
            message = content["message"]
            channel = str(content["channel"])
            print(f"Received message for channel {channel}: {message}")

            async_to_sync(self.channel_layer.group_send)(
                channel,
                {
                    "type": "chat_message",
                    "message": message,
                    "author": content.get("author", "Anonymous"),
                },
            )
        except Exception as e:
            print("Error in receive_json:", str(e))
            self.close()

    def chat_message(self, event):
        print(f"Sending message: {event}")
        try:
            self.send_json(event)
        except Exception as e:
            print("Error in send_json:", str(e))
            self.close()
