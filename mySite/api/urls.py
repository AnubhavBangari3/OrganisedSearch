from django.urls import path,include
from .views import RegisterView,LoginUser,LogoutView,GetSingleProfile,PostFile,GetAllFile,SearchFiles,GetOneFile

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
    ]