from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile,UploadFile

from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields for authentication:
      * username
      * password.
    It will try to authenticate the user with when validated.
    """
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        # This will be used when the DRF browsable API is enabled
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        # Take username and password from request
        username = attrs.get('username')
        password = attrs.get('password')
        if username and password:
            # Try to authenticate the user using Django auth framework.
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                # If we don't have a regular user, raise a ValidationError
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        attrs['user'] = user
        return attrs

class RealizerSerializer(serializers.ModelSerializer):
    username=serializers.CharField(write_only=True,required=True)
    email=serializers.EmailField(required=True,
                                 validators=[UniqueValidator(queryset=User.objects.all())])
    password=serializers.CharField(write_only=True,required=True,validators=[validate_password])
    password2=serializers.CharField(write_only=True,required=True)
    class Meta:
        model=User
        fields = ('username', 'email', 'first_name', 'last_name','password', 'password2',)
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    def validate(self,attribute):
        if attribute['password'] != attribute['password2']:
            raise serializers.ValidationError({"password":"Password fields didn't match"})
        return attribute
    def create(self,validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )        
        user.set_password(validated_data['password'])
        user.save()
        return user
class ProfileSerializer(serializers.ModelSerializer):
    username=serializers.PrimaryKeyRelatedField(read_only=True)
    profile_name=serializers.SerializerMethodField("getName")
  
    class Meta:
        model=Profile
        fields=('id','username','first_name','last_name','email','access_token','slug','profile_name')
    def getName(self,instance):
        return instance.username.username
    
class UploadFileSerializer(serializers.ModelSerializer):
    postUser=serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model=UploadFile
        fields=('id','postUser','file',)