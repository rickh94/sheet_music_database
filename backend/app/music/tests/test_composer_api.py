import datetime

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

    def test_login_required(self, test_login_required, composer_url):
        """Test that login is required for the composer url"""
        assert test_login_required(composer_url)


class TestPrivateComposerAPI(object):
    """Test the private composer api"""

    def test_retrieve_composer_list(
        self, get_list_and_serializer, composer_url, composer1, composer2
    ):
        """Test that you can get the composer list"""
        res, serializer = get_list_and_serializer(
            composer_url, Composer, ComposerSerializer
        )

        assert res.status_code == status.HTTP_200_OK
        for item in serializer.data:
            assert item in res.data

    def test_composers_limited_to_user(
        self, authenticated_client, composer_url, composer1, user2_composer
    ):
        """Test that composers returned match current user only"""
        res = authenticated_client.get(composer_url)

        assert res.status_code == status.HTTP_200_OK
        assert len(res.data) == 1
        assert res.data[0]["name"] == composer1.name

    def test_create_composer_successful(
        self, authenticated_client, composer_url, user1
    ):
        """Test creating a new composer"""
        payload = {
            "name": "Franz Schubert",
            "born": datetime.date(1797, 1, 31),
            "died": datetime.date(1828, 11, 19),
            "era": "Romantic",
        }
        authenticated_client.post(composer_url, payload)

        assert Composer.objects.filter(user=user1, name=payload["name"]).exists()

    def test_create_composer_with_shortname(
        self, authenticated_client, composer_url, user1
    ):
        """Test creating a composer with a custom short name"""
        payload = {
            "name": "Robert Schumann",
            "born": datetime.date(1810, 6, 8),
            "died": datetime.date(1856, 7, 29),
            "era": "Romantic",
            "short_name": "Rob",
        }

        authenticated_client.post(composer_url, payload)

        composer_query = Composer.objects.filter(user=user1, name=payload["name"])

        assert composer_query.exists()
        assert composer_query[0].short_name == payload["short_name"]

    def test_create_composer_invalid(self, authenticated_client, composer_url):
        """Test creating invalid composer fails"""
        payload = {"name": ""}
        res = authenticated_client.post(composer_url, payload)

        assert res.status_code == status.HTTP_400_BAD_REQUEST
