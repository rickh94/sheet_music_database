import pytest
from django.urls import reverse
from knox.models import AuthToken
from rest_framework import status
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


@pytest.fixture
def login_url():
    return reverse("accounts:login")


@pytest.fixture
def logout_url():
    return reverse("accounts:logout")


@pytest.fixture
def registration_url():
    return reverse("accounts:registration")


@pytest.fixture
def logoutall_url():
    return reverse("accounts:logoutall")


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def login_payload(user1, user1_password):
    return {"email": user1.email, "password": user1_password}


def test_login_returns_token(client, login_url, login_payload, user1):
    """Test that you can log in"""
    res = client.post(login_url, login_payload)

    assert res.status_code == status.HTTP_200_OK
    assert "token" in res.data


def test_login_returns_different_token(login_payload, login_url, client):
    """Test that each login returns a different token"""
    res1 = client.post(login_url, login_payload)
    res2 = client.post(login_url, login_payload)

    assert res1.status_code == status.HTTP_200_OK
    assert res2.status_code == status.HTTP_200_OK

    assert res1.data["token"] != res2.data["token"]


def test_logout_deletes_token(client, login_url, login_payload, logout_url):
    """Test that logging out deletes token"""
    res1 = client.post(login_url, login_payload)
    client.credentials(HTTP_AUTHORIZATION=f"Token {res1.data['token']}")
    res2 = client.post(logout_url)

    assert res2.status_code == status.HTTP_204_NO_CONTENT
    assert len(AuthToken.objects.filter(token_key__in=res1.data["token"])) == 0
