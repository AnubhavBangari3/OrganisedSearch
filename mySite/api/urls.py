from django.urls import path,include
from .views import RegisterView,LoginUser,LogoutView,GetSingleProfile,PostFile,GetAllFile,SearchFiles,GetOneFile, MoveToBinAPIView, SaveFileAPIView,SavedFilesAPIView,GetBinFilesAPIView,NotSaveFileAPIView,GetAllFileData,AskQuestionAPIView

from rest_framework.routers import DefaultRouter


router=DefaultRouter()
router.register("register",RegisterView,basename="register")

urlpatterns=[
    path("",include(router.urls)),
    path("login",LoginUser.as_view(),name="login"),
    path("logout",LogoutView.as_view(),name="logout"),
    path("profile/",GetSingleProfile.as_view(),name="getSingleProfile"),
    path("uploadfile/",PostFile.as_view(),name="uploadfile"),
    path("getfiles/",GetAllFile.as_view(),name="getfiles"),
    path("search/",SearchFiles.as_view(),name="search"),
    path("file/<int:id>/",GetOneFile.as_view(),name="file"),
    #path("searchPara/", SearchParagraphsView.as_view(), name="search-paragraphs"),
    path("file/bin/<int:file_id>/", MoveToBinAPIView.as_view(), name="move-to-bin"),
    path("file/save/<int:file_id>/", SaveFileAPIView.as_view(), name="save-file"),
    path("file/saved/", SavedFilesAPIView.as_view(), name="saved-files"),
    path("file/bin/", GetBinFilesAPIView.as_view(), name="get-bin-files"),
    path("file/unsaved/<int:file_id>/", NotSaveFileAPIView.as_view(), name="unsaved-files"),
    path("getAllfiles/",GetAllFileData.as_view(),name="getfiles"),
    path("ask/", AskQuestionAPIView.as_view(), name="ask-question"),
    ]