from rest_framework import mixins, status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Composer, Piece, Sheet, Tag
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


class SheetViewSet(BasicMusicAttrViewSet):
    """ViewSet for Sheets"""

    serializer_class = serializers.SheetSerializer
    queryset = Sheet.objects.all()

    def get_serializer_class(self):
        """Return needed serializer class"""
        if self.action == "upload_file":
            return serializers.SheetFileSerializer
        return self.serializer_class

    def get_queryset(self):
        """Limit queryset to user's sheets"""
        return self.queryset.filter(user=self.request.user)

    @action(methods=["POST"], detail=True, url_path="upload-file")
    def upload_file(self, request, pk=None):
        """Upload a file to the sheet object"""
        sheet = self.get_object()
        serializer = self.get_serializer(sheet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PieceViewSet(viewsets.ModelViewSet, GenericMusicViewSet):
    """Manage pieces in the database"""

    serializer_class = serializers.PieceSerializer
    queryset = Piece.objects.all()

    def get_queryset(self):
        """Get pieces for authenticated user"""
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Add user to piece"""
        serializer.save(user=self.request.user)
