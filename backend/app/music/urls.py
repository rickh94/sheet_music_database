from django.urls import path, include
from rest_framework.routers import DefaultRouter

from music import views

router = DefaultRouter()
router.register("composers", views.ComposerViewSet)
router.register("tags", views.TagViewSet)

app_name = "music"

urlpatterns = [path("", include(router.urls))]
