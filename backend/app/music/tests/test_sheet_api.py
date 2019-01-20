import os

import pytest
from django.urls import reverse
from rest_framework import status

from core.models import Sheet
from music.serializers import SheetSerializer

pytestmark = pytest.mark.django_db


@pytest.fixture
def sheets_url():
    return reverse("music:sheet-list")


@pytest.fixture
def sheet_upload_url():
    def _url(sheet_id):
        return reverse("music:sheet-upload-file", args=[sheet_id])

    return _url


@pytest.fixture
def sheet_no_file(user1):
    return Sheet.objects.create(
        filename="testfile.pdf", sheet_type="Part", file_format="PDF", user=user1
    )


@pytest.fixture
def test_file(tmp_path):
    tmp_file = tmp_path / "test.pdf"
    with tmp_file.open("wb") as fp:
        fp.write(b"testdata")
    return tmp_file


class TestPublicSheetAPI:
    """Test public part of api"""

    def test_login_required(self, test_login_required, sheets_url):
        """Test that login is required to get sheet information"""
        assert test_login_required(sheets_url)


class TestPrivateSheetAPI:
    """Test private part of api"""

    def test_retrieve_sheet_list(
        self, get_list_and_serializer, sheets_url, sheet1, sheet2
    ):
        """Test getting the list of sheets"""
        res, serializer = get_list_and_serializer(sheets_url, Sheet, SheetSerializer)

        assert res.status_code == status.HTTP_200_OK
        assert len(res.data) == 2
        filenames = [item["filename"] for item in res.data]
        for item in serializer.data:
            assert item["filename"] in filenames

    def test_sheets_limited_to_user(
        self, authenticated_client, sheets_url, user1, sheet1, user2_sheet
    ):
        """Test only a user's sheets are found"""
        res = authenticated_client.get(sheets_url)

        assert res.status_code == status.HTTP_200_OK
        assert len(res.data) == 1
        assert res.data[0]["filename"] == sheet1.filename

        filenames = [item["filename"] for item in res.data]
        assert user2_sheet.filename not in filenames

    def test_sheet_created_with_file_successful(
        self, authenticated_client, sheets_url, user1, test_file
    ):
        """Test creating a sheet with a file at the same time"""
        with test_file.open("rb") as the_file:
            payload = {
                "filename": "test.pdf",
                "file_format": "pdf",
                "sheet_type": "Part",
                "file": the_file,
            }
            authenticated_client.post(sheets_url, payload, format="multipart")

        assert Sheet.objects.filter(user=user1, filename=payload["filename"]).exists()

    def test_sheet_created_without_file_fails(
        self, authenticated_client, sheets_url, user1
    ):
        """Test creating a sheet"""
        payload = {"filename": "test.pdf", "file_format": "pdf", "sheet_type": "Part"}
        res = authenticated_client.post(sheets_url, payload)

        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_sheet_invalid(self, authenticated_client, sheets_url):
        """Test creating an invalid sheet"""
        payload = {"filename": ""}
        res = authenticated_client.post(sheets_url, payload)

        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_uploading_file_to_sheet(
        self, authenticated_client, sheet_upload_url, sheet_no_file, tmp_path, test_file
    ):
        """Test uploading a file to a sheet"""
        url = sheet_upload_url(sheet_no_file.id)

        with test_file.open("rb") as the_file:
            res = authenticated_client.post(url, {"file": the_file}, format="multipart")

        sheet_no_file.refresh_from_db()

        assert res.status_code == status.HTTP_200_OK
        assert "file" in res.data
        assert os.path.exists(sheet_no_file.file.path)
