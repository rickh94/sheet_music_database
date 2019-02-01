from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Composer, Instrument, Piece, Sheet, Tag
from music import serializers


class GenericMusicViewSet(viewsets.GenericViewSet):
    """Mixin for custom authentication options"""

    permission_classes = (IsAuthenticated,)


class BasicMusicAttrViewSet(viewsets.ModelViewSet, GenericMusicViewSet):
    """Base ViewSet for user owned music attributes"""

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


class InstrumentViewSet(BasicMusicAttrViewSet):
    """ViewSet for Instruments"""

    serializer_class = serializers.InstrumentSerializer
    queryset = Instrument.objects.all()


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


def _params_to_ints(querystring):
    """Convert a list of string iD to a list of integers"""
    return [int(str_id) for str_id in querystring.split(",")]


def _filter_on_attr(queryset, attr_params, attr_name):
    if attr_params:
        # generate name of filter programmatically
        filters = {f"{attr_name}__id__in": _params_to_ints(attr_params)}
        return queryset.filter(**filters)
    return queryset


class PieceViewSet(viewsets.ModelViewSet, GenericMusicViewSet):
    """Manage pieces in the database"""

    serializer_class = serializers.PieceSerializer
    queryset = Piece.objects.all()

    def get_queryset(self):
        """Get pieces for authenticated user"""
        queryset = self.queryset
        for attr_name in ["tags", "composer", "instruments"]:
            attr_params = self.request.query_params.get(attr_name)
            queryset = _filter_on_attr(queryset, attr_params, attr_name)
        era = self.request.query_params.get("era")
        catalog = self.request.query_params.get("catalog")
        if era:
            queryset = queryset.filter(composer__era__icontains=era)
        if catalog:
            queryset = queryset.filter(catalog__icontains=catalog)
        return queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Add user to piece"""
        serializer.save(user=self.request.user)
