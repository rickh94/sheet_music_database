import datetime

import pytest

from core.models import Composer, Piece, sheet_file_path

pytestmark = pytest.mark.django_db


@pytest.fixture
def composer1(user1):
    return Composer.objects.create(
        name="Johann Sebastian Bach",
        born=datetime.date(1685, 3, 31),
        died=datetime.date(1750, 7, 28),
        era="Baroque",
        user=user1,
    )


@pytest.fixture
def composer_no_dates(user1):
    return Composer.objects.create(name="Test Comp", era="Romantic", user=user1)


@pytest.fixture
def composer_still_alive(user1):
    return Composer.objects.create(
        name="Still is Alive",
        is_alive=True,
        born=datetime.date(1982, 8, 4),
        era="Contemporary",
        short_name="S. is Alive",
        user=user1,
    )


@pytest.fixture
def piece1(composer1, user1):
    piece = Piece.objects.create(title="Sonata I", catalog="BWV 1001", user=user1)
    piece.composer.add(composer1)
    return piece


class TestComposer:
    def test_composer_str(self, composer1):
        """Test that a composer is converted to str"""
        assert (
            f"{composer1.name} ({composer1.born.year} - {composer1.died.year})"
            == str(composer1)
        )

    def test_composer_str_without_dates(self, composer_no_dates):
        """Test that a composer with no dates renders question marks"""
        assert f"{composer_no_dates.name} (? - ?)" == str(composer_no_dates)

    def test_composer_str_still_alive(self, composer_still_alive):
        """Test that a composer that is still alive renders 'present'"""
        assert (
            f"{composer_still_alive.name} ({composer_still_alive.born.year} - present)"
            == str(composer_still_alive)
        )

    def test_composer_generate_short_name(self, composer1):
        """Test that a composers shortened name can be generated"""
        assert "J.S. Bach" == composer1.short_name

    def test_custom_short_name_has_priority(self, composer_still_alive):
        """Test that a composer's custom short name takes priority"""
        assert "S. is Alive" == composer_still_alive.short_name

    def test_short_name_has_stripped_whitespace(self, user1):
        """Test that all whitespace is stripped from a composer's short name"""
        test_comp = Composer.objects.create(name="Test", era="test", user=user1)

        assert test_comp.short_name == "Test"


class TestSheet:
    def test_sheet_str(self, sheet1):
        """Test str representation of sheet"""
        assert sheet1.filename == str(sheet1)

    def test_file_added_correctly(self, sheet1):
        """Test that the file is added correctly"""
        with open(str(sheet1.sheet_file), "r") as sheet_file:
            assert "testdata" in sheet_file.read()

    def test_sheet_path(self, monkeypatch):
        """Test creating correct file paths"""

        def test_name():
            return "testname"

        monkeypatch.setattr("uuid.uuid4", test_name)
        file_path = sheet_file_path(None, "test.ly")
        assert file_path == f"uploads/sheets/testname/test.ly"


class TestPiece:
    def test_piece_str(self, piece1):
        """Test str representation of piece"""
        assert piece1.title == str(piece1)


class TestTag:
    def test_tag_str(self, tag1):
        """Test str representation of tag"""
        assert tag1.name == str(tag1)


class TestInstrument:
    def test_instrument_str(self, instrument1, instrument2):
        """Test str representation of instrument"""
        assert instrument1.name == str(instrument1)
