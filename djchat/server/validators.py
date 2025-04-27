from PIL import Image
from django.core.exceptions import ValidationError
import os

def validate_icon_image_size(image):
    if image:
        with Image.open(image) as img:
            if img.size > (1024 * 1024 * 4):
                raise ValidationError("Image size must be less than 4MB")
            if img.width > 1024 or img.height > 1024:
                raise ValidationError("Image size must be less than 1024x1024")



def validate_image_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".png", ".jpg", ".jpeg", ".gif"]
    if not ext.lower() in valid_extensions:
        raise ValidationError("Unsupported file extension")

