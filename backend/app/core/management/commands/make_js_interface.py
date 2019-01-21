import json
from io import StringIO
from pathlib import Path

from django.core import management
from django.core.management import BaseCommand

from core.management.commands.django_js_url_generator import make_js_api


def get_relevant_urls():
    out = StringIO()
    management.call_command("show_urls", "--format", "json", stdout=out)
    out.seek(0)
    data = json.load(out)
    urls = [
        item["url"]
        for item in data
        if "admin" not in item["url"]
        and ".<format>" not in item["url"]
        and "schema" not in item["url"]
        and "password/reset" not in item["url"]
    ]
    return urls


class Command(BaseCommand):
    """Generate a javascript fluent api class for this api"""

    def add_arguments(self, parser):
        """Add arguments"""
        parser.add_argument("hostname", type=str)
        parser.add_argument("javascript file", type=str)

    def handle(self, *args, **options):
        out = get_relevant_urls()
        make_js_api(Path(options["javascript file"]), out, options["hostname"])
