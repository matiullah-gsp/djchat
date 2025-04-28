from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Account
from .serializers import AccountSerializer, CustomTokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user_id = request.query_params.get("user_id", None)
        queryset = self.queryset
        if user_id:
            queryset = queryset.get(id=user_id)
        serializer = self.get_serializer(queryset)
        return Response(serializer.data)


class JWTSetCookieMixin:
    def finalize_response(self, request, response, *args, **kwargs):
        from django.conf import settings

        response = super().finalize_response(request, response, *args, **kwargs)
        if response.data.get("refresh"):
            response.set_cookie(
                key="refresh",
                value=response.data["refresh"],
                httponly=settings.SIMPLE_JWT["JWT_COOKIE_HTTP_ONLY"],
                secure=settings.SIMPLE_JWT["JWT_COOKIE_SECURE"],
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
        if response.data.get("access"):
            response.set_cookie(
                key="access",
                value=response.data["access"],
                httponly=settings.SIMPLE_JWT["JWT_COOKIE_HTTP_ONLY"],
                secure=settings.SIMPLE_JWT["JWT_COOKIE_SECURE"],
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )

        # del response.data["access"]
        return super().finalize_response(request, response, *args, **kwargs)


class JWTCookieTokenObtainPairView(JWTSetCookieMixin, TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
