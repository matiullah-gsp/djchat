from django.db import models
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.dispatch import receiver
import os
from .validators import validate_icon_image_size, validate_image_file_extension
from base.models import BaseUUIDModel


def category_icon_upload_path(instance, filename):
    return f"category_icons/{instance.id}/{filename}"


def server_banner_upload_path(instance, filename):
    return f"server_banners/{instance.id}/{filename}"


def server_icon_upload_path(instance, filename):
    return f"server_icons/{instance.id}/{filename}"


class Category(BaseUUIDModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.FileField(upload_to=category_icon_upload_path, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.pk and Category.objects.filter(pk=self.pk).exists():
            existing = Category.objects.get(pk=self.pk)
            if existing.icon != self.icon:
                existing.icon.delete(save=False)
        super().save(*args, **kwargs)

    @receiver(models.signals.pre_delete, sender="server.Category")
    def category_delete_files(sender, instance, **kwargs):
        for field in instance._meta.fields:
            if field.name == "icon":
                if getattr(instance, field.name):
                    file_path = getattr(instance, field.name).path
                    if os.path.exists(file_path):
                        os.remove(file_path)

    def __str__(self):
        return self.name


class Server(BaseUUIDModel):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="server_owner"
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="server_category"
    )
    description = models.CharField(max_length=250, blank=True, null=True)
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="server_members"
    )

    def __str__(self):
        return self.name


class Channel(BaseUUIDModel):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="channel_owner"
    )
    topic = models.CharField(max_length=100)
    server = models.ForeignKey(
        Server, on_delete=models.CASCADE, related_name="channels"
    )
    banner = models.ImageField(
        upload_to=server_banner_upload_path,
        blank=True,
        null=True,
        validators=[validate_image_file_extension],
    )
    icon = models.ImageField(
        upload_to=server_icon_upload_path,
        blank=True,
        null=True,
        validators=[validate_icon_image_size, validate_image_file_extension],
    )

    def save(self, *args, **kwargs):
        if self.pk and Channel.objects.filter(pk=self.pk).exists():
            existing = Channel.objects.get(pk=self.pk)
            if existing.banner != self.banner:
                existing.banner.delete(save=False)
            if existing.icon != self.icon:
                existing.icon.delete(save=False)
        self.name = self.name.lower()
        super().save(*args, **kwargs)

    @receiver(models.signals.pre_delete, sender="server.Server")
    def server_delete_files(sender, instance, **kwargs):
        for field in instance._meta.fields:
            if field.name == "banner" or field.name == "icon":
                if getattr(instance, field.name):
                    file_path = getattr(instance, field.name).path
                    if os.path.exists(file_path):
                        os.remove(file_path)

    def __str__(self):
        return self.name
