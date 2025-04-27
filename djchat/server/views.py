from django.shortcuts import render
from rest_framework import viewsets
from .models import Server
from .serializers import ServerSerializer
from rest_framework.response import Response






# Create your views here.
class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    
    def list(self, request):
        category = request.query_params.get("category", None)
        qty = request.query_params.get('qty', None)
        by_user = request.query_params.get('by_user', None) == "true"
        
        if category:
            servers = self.queryset.filter(category=category)
        
        if by_user:
            user_id = request.user.id
            self.queryset = self.queryset.filter(members=user_id)
            
        if qty:
            self.queryset = self.queryset[: int(qty)]
            
            
        serializer = self.serializer_class(servers, many=True)
        return Response(serializer.data)
            
        
            




