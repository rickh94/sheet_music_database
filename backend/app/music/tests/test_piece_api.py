import pytest
from django.urls import reverse
from rest_framework import status

from core.models import Piece
from music.serializers import PieceSerializer

pytestmark = pytest.mark.django_db


@pytest.fixture
def piece_url():
    return reverse("music:piece-list")


@pytest.fixture
def piece2(composer1, user1):
    piece = Piece.objects.create(title="Symphony No. 5", catalog="Op. 67", user=user1)
    piece.composer.add(composer1)
    return piece


@pytest.fixture
def piece3(composer2, user1):
    piece = Piece.objects.create(
        title="Concerto in A minor", catalog="RV 356", user=user1
    )
    piece.composer.add(composer2)
    return piece


@pytest.fixture
def user2_piece(composer2, user2):
    piece = Piece.objects.create(
        title="Concerto in E major (Spring)", catalog="RV 269", user=user2
    )
    piece.composer.add(composer2)
    return piece


@pytest.fixture
def test_piece_payload():
    def _make_payload(**kwargs):
        payload = {"title": "Symphony No. 9", "catalog": "Op. 125", **kwargs}
        return payload

    return _make_payload


class TestPublicPieceAPI:
    """Test the publicly available piece api"""

    def test_login_required(self, test_login_required, piece_url):
        """Test login is required to access piece"""
        assert test_login_required(piece_url)


class TestPrivatePieceAPI:
    """Test the private piece api"""

    def test_retrieve_piece_list(
        self, piece2, piece3, piece_url, get_list_and_serializer
    ):
        """Test that you can get the list of pieces"""
        res, serializer = get_list_and_serializer(piece_url, Piece, PieceSerializer)

        assert res.status_code == status.HTTP_200_OK
        for item in serializer.data:
            assert item in res.data

    def test_pieces_limited_to_user(
        self, piece2, user2_piece, piece_url, authenticated_client
    ):
        """Test that pieces match current user only"""
        res = authenticated_client.get(piece_url)

        assert res.status_code == status.HTTP_200_OK
        assert len(res.data) == 1
        assert res.data[0]["title"] == piece2.title

    def test_create_piece_successful(
        self, authenticated_client, piece_url, user1, test_piece_payload
    ):
        """Test that a piece can be created."""
        payload = test_piece_payload()
        res = authenticated_client.post(piece_url, payload)

        assert res.status_code == status.HTTP_201_CREATED
        assert Piece.objects.filter(user=user1, title=payload["title"]).exists()

    def test_create_piece_with_composer(
        self, authenticated_client, piece_url, composer1, test_piece_payload
    ):
        """Test that a piece can be created with a composer"""
        payload = test_piece_payload(composer=[composer1.id])
        res = authenticated_client.post(piece_url, payload)

        assert res.status_code == status.HTTP_201_CREATED

        new_piece = Piece.objects.get(id=res.data["id"])
        composers = new_piece.composer.all()

        assert composers.count() == 1
        assert composer1 in composers

    def test_create_piece_with_tags(
        self, authenticated_client, piece_url, tag1, tag2, test_piece_payload
    ):
        """Test that a piece can be created with tags"""
        payload = test_piece_payload(tags=[tag1.id, tag2.id])
        res = authenticated_client.post(piece_url, payload)

        assert res.status_code == status.HTTP_201_CREATED

        new_piece = Piece.objects.get(id=res.data["id"])
        tags = new_piece.tags.all()

        assert tags.count() == 2
        assert tag1 in tags
        assert tag2 in tags

    def test_create_piece_with_sheets(
        self, authenticated_client, piece_url, sheet1, sheet2, test_piece_payload
    ):
        """Test that a piece can be created with sheets"""
        payload = test_piece_payload(sheets=[sheet1.id, sheet2.id])
        res = authenticated_client.post(piece_url, payload)

        assert res.status_code == status.HTTP_201_CREATED

        new_piece = Piece.objects.get(id=res.data["id"])
        sheets = new_piece.sheets.all()

        assert sheets.count() == 2
        assert sheet1 in sheets
        assert sheet2 in sheets

    def test_create_piece_everything(
        self,
        authenticated_client,
        piece_url,
        composer1,
        tag1,
        sheet1,
        test_piece_payload,
    ):
        """Test a full piece creation"""
        payload = test_piece_payload(
            composer=[composer1.id], tags=[tag1.id], sheets=[sheet1.id]
        )
        res = authenticated_client.post(piece_url, payload)

        assert res.status_code == status.HTTP_201_CREATED
