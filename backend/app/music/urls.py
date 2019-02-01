from django.urls import include, path
from rest_framework.routers import DefaultRouter

from music import views

router = DefaultRouter()
router.register("composers", views.ComposerViewSet)
router.register("tags", views.TagViewSet)
router.register("sheets", views.SheetViewSet)
router.register("pieces", views.PieceViewSet)
router.register("instruments", views.InstrumentViewSet)

app_name = "music"

urlpatterns = [path("", include(router.urls))]
