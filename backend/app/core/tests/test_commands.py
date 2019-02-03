from typing import List, Union
from unittest import mock

from django.core.management import call_command
from django.db import OperationalError


def test_make_js_api_interface(tmp_path):
    tmp_js = tmp_path / "output.js"
    call_command("make_js_interface", "https://example.com", str(tmp_js))

    with tmp_js.open("r") as js_file:
        data = js_file.read()
        assert "class DjangoURL" in data
        assert "get auth()" in data
        assert "this.baseurl = 'https://example.com" in data
        assert "get(initialConfig = {})" in data
        assert "post(payload, initialConfig = {})" in data
        assert "put(payload, initialConfig = {})" in data
        assert "URL()" in data
        assert "get url() {" in data
        assert "admin()" not in data


@mock.patch("django.db.utils.ConnectionHandler.__getitem__")
def test_wait_for_db_ready(gi):
    """Test waiting for the db"""
    gi.return_value = True
    call_command("wait_for_db")
    assert gi.call_count == 1


@mock.patch("django.db.ConnectionHandler.__getitem__")
@mock.patch("time.sleep", return_value=True)
def test_wait_for_db(_time_sleep, gi):
    """Test waiting for the database"""
    # noinspection PyTypeChecker
    gi.side_effect: List[Union[Exception, bool]] = [OperationalError] * 5 + [True]
    call_command("wait_for_db")
    assert gi.call_count == 6
