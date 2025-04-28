from rest_framework import serializers
from .models import Server, Category, Channel


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = "__all__"


class ServerSerializer(serializers.ModelSerializer):
    channels = ChannelSerializer(many=True)
    members_count = serializers.IntegerField(read_only=True)
    category = serializers.StringRelatedField()

    class Meta:
        model = Server
        exclude = ["members"]
