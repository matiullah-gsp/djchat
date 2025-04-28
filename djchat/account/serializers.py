from rest_framework import serializers
from .models import Account
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings
from .crypto import decrypt_token


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "username",
            "email",
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # @classmethod
    # def get_token(
    #     cls, user
    # ):  # this will encode the user info (email, username, user_id) into the token
    #     token = super().get_token(user)
    #     token["user_id"] = str(user.id)
    #     token["username"] = user.username
    #     token["email"] = user.email
    #     return token

    def validate(
        self, attrs
    ):  # this will include user info (email, username, user_id) in the response payload
        data = super().validate(attrs)
        data["user_id"] = str(self.user.id)
        data["username"] = self.user.username
        data["email"] = self.user.email
        return data


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(required=False)

    def validate(self, attrs):
        # Get the encrypted token from cookies
        encrypted_token = self.context["request"].COOKIES.get(
            settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"]
        )

        # Decrypt the token
        refresh_token = decrypt_token(encrypted_token)

        if refresh_token:
            attrs["refresh"] = refresh_token
            return super().validate(attrs)
        raise InvalidToken("No valid refresh token found")
