from django.shortcuts import render
from rest_framework import viewsets
from .models import Message
from .serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        channel_id = self.request.query_params.get("channel_id")
        return self.queryset.filter(conversation__channel_id=channel_id)




