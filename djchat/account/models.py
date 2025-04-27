
from django.contrib.auth.models import AbstractUser
from base.models import BaseUUIDModel

# Create your models here.
class Account(AbstractUser, BaseUUIDModel):
    pass