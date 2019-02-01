import pytest
from django.urls import reverse
from rest_framework import status

from core.models import Tag
from music.serializers import TagSerializer

pytestmark = pytest.mark.django_db


@pytest.fixture
def tag_url():
    return reverse("music:tag-list")


@pytest.fixture
def user2_tag(user2):
    return Tag.objects.create(name="user2 tag", user=user2)


class TestPublicTagAPI:
    """Test the publicly available tag api"""

    def test_login_required(self, tag_url, test_login_required):
        """Test that login is required for tag api"""
        assert test_login_required(tag_url)


class TestPrivateTagAPI:
    """Test the private tag api"""

    def test_retrieve_tag_list(
        self,
        get_list_and_serializer,
        tag_url,
        tag1,
        tag2,
        all_data_in_res,
        status_ok,
        no_extra_data_in_res,
    ):
        """Test getting the Tag list"""
        res, serializer = get_list_and_serializer(tag_url, Tag, TagSerializer)

        assert res.status_code == status.HTTP_200_OK
        assert all_data_in_res(res, serializer)
        assert no_extra_data_in_res(res, serializer)

    def test_tags_limited_to_user(
        self, authenticated_client, tag_url, tag1, user2_tag, status_ok
    ):
        """Test tags are limited only to user"""
        res = authenticated_client.get(tag_url)

        assert status_ok(res)
        assert len(res.data) == 1
        assert res.data[0]["name"] == tag1.name

    def test_create_tag_successful(self, authenticated_client, tag_url, user1):
        """Test creating a tag"""
        payload = {"name": "Test Tag"}
        authenticated_client.post(tag_url, payload)

        assert Tag.objects.filter(user=user1, name=payload["name"]).exists()

    def test_create_tag_invalid(self, authenticated_client, tag_url):
        """Test creating invalid tag fails"""
        payload = {"name": ""}
        res = authenticated_client.post(tag_url, payload)

        assert res.status_code == status.HTTP_400_BAD_REQUEST
