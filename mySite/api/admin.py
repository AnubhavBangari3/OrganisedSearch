from django.contrib import admin
from .models import Profile,UploadFile,Paragraph

# Register your models here.
admin.site.register(Profile)
admin.site.register(UploadFile)
admin.site.register(Paragraph)