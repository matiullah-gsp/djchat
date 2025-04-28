from rest_framework import serializers
from .models import Account
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "username",
            "email",
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user): # this will encode the user info (email, username, user_id) into the token
        token = super().get_token(user)
        token["user_id"] = str(user.id)
        token["username"] = user.username
        token["email"] = user.email
        return token

    # def validate(self, attrs): # this will include user info (email, username, user_id) in the response payload
    #     data = super().validate(attrs)
    #     data["user_id"] = str(self.user.id)
    #     data["username"] = self.user.username
    #     data["email"] = self.user.email
    #     return data
