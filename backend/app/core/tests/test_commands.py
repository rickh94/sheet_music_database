from django.core.management import call_command


def test_make_js_api_interface(tmp_path):
    tmp_js = tmp_path / "output.js"
    call_command("make_js_interface", "example.com", str(tmp_js))

    with tmp_js.open("r") as js_file:
        data = js_file.read()
        assert "class DjangoURL" in data
        assert "get auth()" in data
        assert "this.baseurl = 'https://example.com" in data
        assert "get(initialConfig = {})" in data
        assert "post(payload, initialConfig = {})" in data
        assert "put(payload, initialConfig = {})" in data
        assert "URL()" in data
        assert "admin()" not in data
