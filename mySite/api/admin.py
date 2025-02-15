from django.contrib import admin
from .models import Profile,UploadFile,Bin

class BinAdmin(admin.ModelAdmin):
    list_display = ('id', 'postUserB', 'fileB', 'deleted_at')  

# Register your models here.
admin.site.register(Profile)
admin.site.register(UploadFile)
admin.site.register(Bin,BinAdmin)
