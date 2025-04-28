from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from .crypto import decrypt_token


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        encrypted_token = (
            request.COOKIES.get(settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"]) or None
        )

        if encrypted_token is None:
            return None

        # Decrypt the token
        raw_token = decrypt_token(encrypted_token)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
