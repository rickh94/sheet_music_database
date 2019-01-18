import pytest
from django.contrib.auth import get_user_model

pytestmark = pytest.mark.django_db


@pytest.fixture
def user1_password():
    return "The 44th President"


@pytest.fixture
def user2_password():
    return "The 44th First Lady"


@pytest.fixture
def user1(user1_password):
    return get_user_model().objects.create_user(
        username="barack", email="barack@whitehouse.gov", password=user1_password
    )


@pytest.fixture
def user2(user2_password):
    return get_user_model().objects.create_user(
        username="michelle", email="michelle@whitehouse.gov", password=user2_password
    )
