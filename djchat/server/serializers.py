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
    channel_server = ChannelSerializer(many=True)
    num_members = serializers.IntegerField(read_only=True)
    # category = serializers.StringRelatedField()

    class Meta:
        model = Server
        exclude = ["member"]
