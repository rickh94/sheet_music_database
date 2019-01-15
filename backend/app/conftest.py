import pytest
from django.contrib.auth import get_user_model

pytestmark = pytest.mark.django_db


@pytest.fixture
def user1():
    return get_user_model().objects.create_user(
        "barack@whitehouse.gov", "The 44th President"
    )


@pytest.fixture
def user2():
    return get_user_model().objects.create_user(
        "michelle@whitehouse.gov", "The 44th First Lady"
    )
