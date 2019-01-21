import knox.views
from allauth.account.views import ConfirmEmailView
from django.urls import include, path
from rest_auth.views import PasswordResetConfirmView

from accounts import views

app_name = "accounts"

urlpatterns = [
    path("login/", views.KnoxLoginView.as_view(), name="login"),
    path("registration/", views.KnoxRegisterView.as_view(), name="registration"),
    path("logout/", knox.views.LogoutView.as_view(), name="logout"),
    path("logoutall/", knox.views.LogoutAllView.as_view(), name="logoutall"),
    path(
        "password/reset/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view,
        name="password_reset_confirm",
    ),
    path(
        "registration/account-confirm-email/<key>",
        ConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
    path("", include("rest_auth.urls")),
    path("", include("allauth.urls")),
]
