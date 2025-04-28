from rest_framework import viewsets
from .models import Server
from .serializers import ServerSerializer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    # permission_classes = [IsAuthenticated]

    def list(self, request):
        category = request.query_params.get("category", None)
        qty = request.query_params.get("qty", None)
        by_user = request.query_params.get("by_user", None) == "true"
        server_id = request.query_params.get("server_id", None)
        with_members_count = (
            request.query_params.get("with_members_count", None) == "true"
        )

        if by_user and not server_id and not request.user.is_authenticated:
            raise ValidationError("User is not authenticated")

        servers = self.queryset

        if category:
            servers = servers.filter(category=category)
            print(servers)

        # Always annotate with members_count if requested
        if with_members_count:
            servers = servers.annotate(members_count=Count("member"))

        if by_user:
            user_id = request.user.id
            servers = servers.filter(member=user_id)

        if qty:
            try:
                servers = servers[: int(qty)]
            except ValueError:
                raise ValidationError("Invalid quantity value")

        if server_id:
            try:
                servers = servers.filter(id=server_id)
                if not servers.exists():
                    raise ValidationError("Server not found")
            except ValueError:
                raise ValidationError("Invalid server ID")

        serializer = self.serializer_class(servers, many=True)
        return Response(serializer.data)
