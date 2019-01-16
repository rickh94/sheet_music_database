import datetime

import pytest

from rest_framework.test import APIClient

from core.models import Composer

pytestmark = pytest.mark.django_db


# --------------------- CLIENTS -----------------------------
@pytest.fixture
def public_client():
    return APIClient()


@pytest.fixture
def authenticated_client(user1):
    client = APIClient()
    client.force_authenticate(user1)
    return client


# --------------- COMPOSERS ------------------------
@pytest.fixture
def composer1(user1):
    return Composer.objects.create(
        name="Ludwig van Beethoven",
        born=datetime.date(1770, 12, 17),
        died=datetime.date(1827, 3, 26),
        era="Romantic",
        short_name="L. van Beethoven",
        user=user1,
    )


@pytest.fixture
def composer2(user1):
    return Composer.objects.create(
        name="Antonio Vivaldi",
        born=datetime.date(1678, 3, 4),
        died=datetime.date(1741, 7, 28),
        era="Baroque",
        user=user1,
    )


@pytest.fixture
def user2_composer(user2):
    return Composer.objects.create(
        name="Johannes Brahms",
        born=datetime.date(1833, 7, 7),
        died=datetime.date(1897, 4, 3),
        era="Romantic",
        user=user2,
    )
