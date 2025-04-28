from django.db import models
from base.models import BaseUUIDModel
from server.models import Channel
from django.contrib.auth import get_user_model

User = get_user_model()


class Conversation(BaseUUIDModel):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)

    


class Message(BaseUUIDModel):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content
