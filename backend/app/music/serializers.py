from rest_framework import serializers

from core.models import Composer, Instrument, Piece, Sheet, Tag


class ComposerSerializer(serializers.ModelSerializer):
    """Serializer for composer objects"""

    class Meta:
        model = Composer
        fields = ("id", "name", "born", "died", "era", "short_name")
        read_only_fields = ("id",)


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag objects"""

    class Meta:
        model = Tag
        fields = ("id", "name")
        read_only_fields = ("id",)


class SheetSerializer(serializers.ModelSerializer):
    """Serializer for Sheet objects"""

    class Meta:
        model = Sheet
        fields = ("id", "filename", "file_format", "sheet_type", "sheet_file")
        read_only_fields = ("id",)


class SheetFileSerializer(serializers.ModelSerializer):
    """Serializer for sheet details"""

    class Meta:
        model = Sheet
        fields = ("id", "sheet_file")
        read_only_fields = ("id",)


class InstrumentSerializer(serializers.ModelSerializer):
    """Serializer for Instrument objects"""

    class Meta:
        model = Instrument
        fields = ("id", "name")
        read_only_fields = ("id",)

    @staticmethod
    def validate_name(name):
        """Validate the instrument name"""
        return name.lower()


class PieceSerializer(serializers.ModelSerializer):
    """Serializer for pieces"""

    composer = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Composer.objects.all()
    )
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all())
    sheets = serializers.PrimaryKeyRelatedField(many=True, queryset=Sheet.objects.all())
    instruments = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Instrument.objects.all()
    )

    class Meta:
        model = Piece
        fields = ("id", "title", "catalog", "composer", "tags", "sheets", "instruments")
        read_only_fields = ("id",)
