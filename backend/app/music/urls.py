from django.urls import path, include
from rest_framework.routers import DefaultRouter

from music import views

router = DefaultRouter()
router.register("composer", views.ComposerViewSet)

app_name = "music"

urlpatterns = [path("", include(router.urls))]
