import knox.views
from django.urls import path, include

from accounts import views

app_name = "accounts"

urlpatterns = [
    path("login/", views.KnoxLoginView.as_view(), name="login"),
    path("registration/", views.KnoxRegisterView.as_view(), name="registration"),
    path("logout/", knox.views.LogoutView.as_view(), name="logout"),
    path("logoutall/", knox.views.LogoutAllView.as_view(), name="logoutall"),
    path("", include("rest_auth.urls")),
]
