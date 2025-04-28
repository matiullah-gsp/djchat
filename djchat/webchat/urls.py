from django.urls import path
from .consumers import WebChatConsumer

websocket_urlpatterns = [
    path("ws/chat/<str:channel_id>/", WebChatConsumer.as_asgi()),
]
