from .models import Profile
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save,sender=User)
def create_profile(sender,instance,created,**kwargs):
    current=User.objects.get(username=instance)
    if created:
        Profile.objects.create(username=instance,first_name=current.first_name,last_name=current.last_name,email=current.email)