# Create your views here.
from rest_framework import viewsets
from .models import Account
from .serializers import (
    AccountSerializer,
    CustomTokenObtainPairSerializer,
    CustomTokenRefreshSerializer,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .crypto import encrypt_token


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
            # Encrypt the refresh token
            encrypted_refresh = encrypt_token(response.data["refresh"])
            response.set_cookie(
                key=settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"],
                value=encrypted_refresh,
                httponly=settings.SIMPLE_JWT["JWT_COOKIE_HTTP_ONLY"],
                secure=settings.SIMPLE_JWT["JWT_COOKIE_SECURE"],
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
            del response.data["refresh"]
        if response.data.get("access"):
            # Encrypt the access token
            encrypted_access = encrypt_token(response.data["access"])
            response.set_cookie(
                key=settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"],
                value=encrypted_access,
                httponly=settings.SIMPLE_JWT["JWT_COOKIE_HTTP_ONLY"],
                secure=settings.SIMPLE_JWT["JWT_COOKIE_SECURE"],
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
            del response.data["access"]
        return response


class JWTCookieTokenObtainPairView(JWTSetCookieMixin, TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class JWTCookieTokenRefreshView(JWTSetCookieMixin, TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer
