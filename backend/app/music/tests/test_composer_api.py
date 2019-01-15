import pytest
from django.urls import reverse
from rest_framework import status

from core.models import Composer
from music.serializers import ComposerSerializer

pytestmark = pytest.mark.django_db


@pytest.fixture
def composer_url():
    return reverse("music:composer-list")


class TestPublicComposerAPI(object):
    """Test the publicly available composer api"""

    def test_login_required(self, public_client, composer_url):
        """Test that login is required for the composer url"""
        res = public_client.get(composer_url)
        assert res.status_code == status.HTTP_401_UNAUTHORIZED


class TestPrivateComposerAPI(object):
    """Test the private composer api"""

    def test_retrieve_composer_list(
        self, authenticated_client, composer_url, composer1, composer2
    ):
        """Test that you can get the composer list"""
        res = authenticated_client.get(composer_url)
        composers = Composer.objects.all()
        serializer = ComposerSerializer(composers, many=True)

        assert res.status_code == status.HTTP_200_OK
        assert res.data == serializer.data
