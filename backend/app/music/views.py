from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Composer
from music import serializers


class ComposerViewSet(viewsets.ModelViewSet):
    """Viewset for composers"""

    serializer_class = serializers.ComposerSerializer
    queryset = Composer.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """Get queryset for Composers associated with piece"""
        return self.queryset.filter(user=self.request.user).order_by("-name")

    def perform_create(self, serializer):
        """Create a new composer"""
        serializer.save(user=self.request.user)
