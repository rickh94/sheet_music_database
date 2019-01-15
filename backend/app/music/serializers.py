from rest_framework import serializers

from core.models import Composer


class ComposerSerializer(serializers.ModelSerializer):
    """Serializer for composer objects"""

    class Meta:
        model = Composer
        fields = ("id", "name", "born", "died", "era", "short_name")
        read_only_fields = ("id",)
