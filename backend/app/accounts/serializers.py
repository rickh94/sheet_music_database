from rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers


class KnoxSerializer(serializers.Serializer):
    """Serializer for Knox authentication"""

    token = serializers.CharField()
    user = UserDetailsSerializer()
