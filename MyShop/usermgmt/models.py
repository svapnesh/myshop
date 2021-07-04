from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.conf import settings

from usermgmt.helpers import UserManager


# Abstract model to use in other models
class BaseModel(models.Model):
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now, db_index=True,
                                      verbose_name=_('Created At'))
    modified_at = models.DateTimeField(auto_now=True, db_index=True,
                                       verbose_name=_('Modified At'))

    class Meta:
        abstract = True


# Extend inbuilt user model
class User(AbstractUser, BaseModel):
    email = models.CharField(max_length=100, unique=True)
    mobile_number = models.CharField(max_length=10, null=True, blank=True)
    
    USERNAME_FIELD = settings.AUTH_USERNAME_FIELD
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email