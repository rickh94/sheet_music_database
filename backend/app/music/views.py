from django.shortcuts import render
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
