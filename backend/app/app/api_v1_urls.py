from django.urls import path, include

urlpatterns = [
    path("auth/", include("accounts.urls")),
    path("music/", include("music.urls")),
]
