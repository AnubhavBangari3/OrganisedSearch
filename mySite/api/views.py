from django.shortcuts import render
from django.contrib.auth import authenticate,login

from django.contrib.auth.models import User
from .models import Profile
from .serializers import RealizerSerializer,LoginSerializer,ProfileSerializer

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
import requests

from rest_framework.permissions import IsAuthenticated

# Create your views here.
class GetSingleProfile(APIView):
      permission_classes=[IsAuthenticated]
      serializer_class=ProfileSerializer
      
      def get(self,request):
            user=User.objects.get(username=self.request.user)
            profile=Profile.objects.get(username_id=request.user.id)
            print(profile)
            serializer=ProfileSerializer(profile,many=False)
            return Response(serializer.data)
      
class RegisterView(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=RealizerSerializer

class LoginUser(APIView):
      
      def post(self,request,format=None):
            serializer =LoginSerializer(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            password = serializer.validated_data['password']
            user=authenticate(username=user,password=password)
            print("is authenticated")
            login(request, user)
            d={}
            
            if user:#Create a field in profile for token. And add auto update logic from backend.
                  t=RefreshToken.for_user(user)
                  #CHeck its working
                  p=Profile.objects.get(username=user.id)
                  print("Profile:",p)
                  p.access_token=str(t.access_token),
                  p.save()
                 
                
                 
                  
                  if p.access_token is not None:
                        print("Access token")
                  else:
                        print("No access token yet")
                        
                  
                  d={"user":user.username,
                  'refresh': str(t),
                  'access': str(t.access_token),
                  }
                  print(d)
                  return Response(d, status=status.HTTP_202_ACCEPTED)
            
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
  
      def get(self,request):
            #u=User.objects.all()
            #print(u)
            user = User.objects.get(username=self.request.user)
            serializer=LoginSerializer(user,many=False)
            t=RefreshToken.for_user(user)
            
            d={"user":user.username,
                  'refresh': str(t),
                  'access': str(t.access_token),
                  }
            print(d)
            return Response(d, status=status.HTTP_202_ACCEPTED)
      
class LogoutView(APIView):
      
      permission_classes=(IsAuthenticated,)
      def post(self, request):
            
        try:
            print("Inside log out")
            refresh_token = request.data["refresh_token"]
            print("Refresh:",refresh_token)
            print(request.user)
            #RefreshToken.for_user(user)
            token = RefreshToken.for_user(request.user)
            print("Token:",token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("Inside log out except")
            return Response(status=status.HTTP_400_BAD_REQUEST)

