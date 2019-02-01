import pytest
from django.urls import reverse
from rest_framework import status

from core.models import Instrument

from music.serializers import InstrumentSerializer

pytestmark = pytest.mark.django_db


@pytest.fixture
def instrument_url():
    return reverse("music:instrument-list")


class TestPublicInstrumentAPI:
    """Test the publicly available instrument api"""

    def test_login_required(self, instrument_url, test_login_required):
        """Test that login is required"""
        assert test_login_required(instrument_url)


class TestPrivateInstrumentAPI:
    """Test the private instrument api"""

    def test_retrieve_instrument_list(
        self,
        get_list_and_serializer,
        instrument_url,
        instrument1,
        instrument2,
        status_ok,
        no_extra_data_in_res,
        all_data_in_res,
    ):
        """Test getting the Instrument list"""
        res, serializer = get_list_and_serializer(
            instrument_url, Instrument, InstrumentSerializer
        )

        assert status_ok(res)
        assert no_extra_data_in_res(res, serializer)
        assert all_data_in_res(res, serializer)

    def test_instruments_limited_to_user(
        self,
        authenticated_client,
        instrument_url,
        instrument1,
        user2_instrument,
        status_ok,
    ):
        """Test that instruments are limited to the user"""
        res = authenticated_client.get(instrument_url)

        assert status_ok(res)
        assert len(res.data) == 1
        assert res.data[0]["name"] == instrument1.name

    def test_create_instrument_successful(
        self, authenticated_client, instrument_url, user1
    ):
        """Test that instruments are successfully created"""
        payload = {"name": "violin"}
        authenticated_client.post(instrument_url, payload)

        assert Instrument.objects.filter(user=user1, name=payload["name"]).exists()

    def test_instrument_name_normalized(
        self, authenticated_client, instrument_url, user1
    ):
        """Test that instrument names are lower cased by the serializer"""
        payload = {"name": "BAsOon"}
        authenticated_client.post(instrument_url, payload)

        assert Instrument.objects.filter(
            user=user1, name=payload["name"].lower()
        ).exists()
        assert not Instrument.objects.filter(user=user1, name=payload["name"]).exists()

    def test_create_instrument_invalid(self, authenticated_client, instrument_url):
        """Test creating an invalid instrument fails"""
        payload = {"name": ""}
        res = authenticated_client.post(instrument_url, payload)

        assert res.status_code == status.HTTP_400_BAD_REQUEST
