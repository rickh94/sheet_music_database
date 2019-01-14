import subprocess

import click

from cli.commands.build_frontend import build_js_frontend


@click.command()
def cli():
    """
    Rebuild the docker container

    :return: Subprocess call result
    """
    build_js_frontend()
    cmd = "docker-compose down && docker-compose build"
    return subprocess.call(cmd, shell=True)
