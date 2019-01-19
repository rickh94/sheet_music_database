from django.urls import include, path

urlpatterns = [
    path("auth/", include("accounts.urls")),
    path("music/", include("music.urls")),
]
