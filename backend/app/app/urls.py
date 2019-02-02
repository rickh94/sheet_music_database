"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from allauth.account.views import ConfirmEmailView
from django.contrib import admin
from django.urls import include, path
from rest_auth.views import PasswordResetConfirmView
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    path("v1/", include("app.api_v1_urls")),
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
    path(
        "docs/",
        include_docs_urls(
            title="Sheet Music Database",
            authentication_classes=[],
            permission_classes=[],
        ),
    ),
]
