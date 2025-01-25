from django.shortcuts import render
from django.contrib.auth import authenticate,login

from django.contrib.auth.models import User
from .models import Profile,UploadFile
from .serializers import RealizerSerializer,LoginSerializer,ProfileSerializer,UploadFileSerializer

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
import requests
from PyPDF2 import PdfReader
from pathlib import Path
from docx import Document  # For handling .docx files
import csv  # For handling .csv files
import openpyxl  # For handling .xlsx files
from django.http import JsonResponse

# Create your views here.

class PostFile(APIView):
     permission_classes=[IsAuthenticated]
     serializer_class=UploadFileSerializer

     def post(self,request):
            profile=Profile.objects.get(username_id=request.user.id)
            
            ##print("post profile:",profile)
            serializer=UploadFileSerializer(data=request.data)
            ##print("serializer:",serializer)
            if serializer.is_valid(raise_exception=True):
                  ##print("serializer 1:",serializer)
                  serializer.save(postUser=profile)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                  ##print("serializer 2:",serializer)
                  return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            
class GetAllFile(APIView):
     permission_classes=[IsAuthenticated]
     serializer_class=UploadFileSerializer

     def get(self,request):
          profile=Profile.objects.get(username_id=request.user.id)
          files=UploadFile.objects.filter(postUser=profile)
          serializer=UploadFileSerializer(files,many=True)
          print("serializer get:",serializer)
          return Response(serializer.data)
import fitz
from fuzzywuzzy import fuzz

import spacy
class SearchFiles(APIView):
    permission_classes = [IsAuthenticated]
    nlp = spacy.load("en_core_web_md")

    def extract_text_from_txt(self, file_path):
        """Extract text from a plain text file (.txt)"""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()

    def extract_text_from_docx(self, file_path):
        """Extract text from a Word document (.docx)"""
        doc = Document(file_path)
        return '\n'.join([para.text for para in doc.paragraphs])

    def extract_text_from_csv(self, file_path):
        """Extract text from a CSV file"""
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            return '\n'.join([' '.join(row) for row in reader])

    def extract_text_from_xlsx(self, file_path):
        """Extract text from an Excel file"""
        wb = openpyxl.load_workbook(file_path)
        sheet = wb.active
        text = ""
        for row in sheet.iter_rows(values_only=True):
            text += ' '.join([str(cell) for cell in row]) + '\n'
        return text

    def get(self, request):
        search_text = request.query_params.get('q', '')  
        print("search_text:", search_text)
        profile = Profile.objects.get(username_id=request.user.id)
        # Convert the search text into a spaCy Doc
        search_doc = self.nlp(search_text.lower())
        # Get all files associated with the profile
        files = UploadFile.objects.filter(postUser=profile)
        matching_results = []  # Store file and matching sentences
        
        for file_instance in files:
            file_path = Path(file_instance.file.path)  
            print("file_path:", file_path)
            try:
                file_text = ""
                # Check file extension and extract text accordingly
                if file_path.suffix.lower() == '.pdf':
                    reader = PdfReader(str(file_path))
                    for page in reader.pages:
                        file_text += page.extract_text()
                elif file_path.suffix.lower() == '.txt':
                    file_text = self.extract_text_from_txt(file_path)
                elif file_path.suffix.lower() == '.docx':
                    file_text = self.extract_text_from_docx(file_path)
                elif file_path.suffix.lower() == '.csv':
                    file_text = self.extract_text_from_csv(file_path)
                elif file_path.suffix.lower() == '.xlsx':
                    file_text = self.extract_text_from_xlsx(file_path)
                else:
                    print(f"Skipping unsupported file type: {file_path.suffix}")
                    continue

                # Process the extracted text with spaCy and search for sentences
                file_doc = self.nlp(file_text)
                matching_sentences = [
                    sent.text.strip()
                    for sent in file_doc.sents  # Tokenize text into sentences
                    if search_text.lower() in sent.text.lower()
                ]
                print("matching_sentences:",matching_sentences)
                if matching_sentences:
                    matching_results.append({
                        "file_name": file_instance.file.name,
                        "matching_sentences": matching_sentences
                    })
                print("matching_results:",matching_results)
              
            except Exception as e:
                print(f"Error reading file {file_path}: {e}")

        # Return matching sentences
        return Response({
            "status": "success",
            "message": "Search completed successfully.",
            "data": matching_results
        })



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

