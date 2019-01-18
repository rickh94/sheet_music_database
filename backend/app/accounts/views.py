from allauth.account.utils import complete_signup
from allauth.account import app_settings as allauth_settings
from rest_auth.registration.views import RegisterView
from rest_auth.views import LoginView
from rest_framework.response import Response

from accounts.serializers import KnoxSerializer
from accounts.utils import create_knox_token


class KnoxLoginView(LoginView):
    """Login view for knox authentication"""

    def get_response(self):
        """Get the response to a login attempt"""
        serializer_class = self.get_response_serializer()

        data = {"user": self.user, "token": self.token}
        serializer = serializer_class(instance=data, context={"request": self.request})

        return Response(serializer.data, status=200)


class KnoxRegisterView(RegisterView):
    """Register for knox authentication"""

    def get_response_data(self, user):
        serializer = KnoxSerializer({"user": user, "token": self.token})
        return serializer.data

    def perform_create(self, serializer):
        """Create a new user"""
        user = serializer.save(self.request)
        self.token = create_knox_token(None, user, None)
        complete_signup(
            self.request._request, user, allauth_settings.EMAIL_VERIFICATION, None
        )
        return user
