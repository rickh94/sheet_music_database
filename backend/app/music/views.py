from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Composer, Tag
from music import serializers


class GenericMusicViewSet(viewsets.GenericViewSet):
    """Mixin for custom authentication options"""

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class BasicMusicAttrViewSet(
    mixins.ListModelMixin, mixins.CreateModelMixin, GenericMusicViewSet
):
    """Base Viewset for user owned music attributes"""

    def get_queryset(self):
        """Get items associated with user"""
        return self.queryset.filter(user=self.request.user).order_by("name")

    def perform_create(self, serializer):
        """Create a new object specific to a user"""
        serializer.save(user=self.request.user)


class ComposerViewSet(BasicMusicAttrViewSet):
    """ViewSet for composers"""

    serializer_class = serializers.ComposerSerializer
    queryset = Composer.objects.all()


class TagViewSet(BasicMusicAttrViewSet):
    """ViewSet for Tags"""

    serializer_class = serializers.TagSerializer
    queryset = Tag.objects.all()
