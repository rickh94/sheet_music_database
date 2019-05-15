import pytest
from django.contrib.auth import get_user_model
from rest_framework import status

from core.models import Sheet, Tag, Instrument

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


@pytest.fixture
def tag1(user1):
    return Tag.objects.create(name="Test", user=user1)


@pytest.fixture
def tag2(user1):
    return Tag.objects.create(name="Test2", user=user1)


@pytest.fixture
def sheet1(tmp_path, user1):
    tmp_file = tmp_path / "test.ly"
    with tmp_file.open("w") as fp:
        fp.write("testdata")
    return Sheet.objects.create(
        filename="testfile.ly",
        sheet_type="Score",
        file_format="LilyPond",
        user=user1,
        sheet_file=str(tmp_file),
    )


@pytest.fixture
def sheet2(tmp_path, user1):
    tmp_file = tmp_path / "test.pdf"
    with tmp_file.open("wb") as fp:
        fp.write(b"testdata")
    return Sheet.objects.create(
        filename="testfile.pdf",
        sheet_type="Part",
        file_format="LilyPond",
        user=user1,
        sheet_file=str(tmp_file),
    )


@pytest.fixture
def user2_sheet(tmp_path, user2):
    tmp_file = tmp_path / "test2.pdf"
    with tmp_file.open("wb") as fp:
        fp.write(b"testdata")
    return Sheet.objects.create(
        filename="testfile2.pdf",
        sheet_type="Part",
        file_format="LilyPond",
        user=user2,
        sheet_file=str(tmp_file),
    )


@pytest.fixture
def instrument1(user1):
    return Instrument.objects.create(name="Violin", user=user1)


@pytest.fixture
def instrument2(user1):
    return Instrument.objects.create(name="viola", user=user1)


@pytest.fixture
def user2_instrument(user2):
    return Instrument.objects.create(name="flute", user=user2)


@pytest.fixture
def status_ok():
    def _ok(response):
        return response.status_code == status.HTTP_200_OK

    return _ok


@pytest.fixture
def status_created():
    def _created(response):
        return response.status_code == status.HTTP_201_CREATED

    return _created


@pytest.fixture
def status_bad_request():
    def _bad(response):
        return response.status_code == status.HTTP_400_BAD_REQUEST

    return _bad
