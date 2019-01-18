import subprocess

import click

from cli.commands.build_frontend import build_js_frontend
from cli.commands.build_requirements import build_py_requirements


@click.command()
def cli():
    """
    Rebuild the docker container

    :return: Subprocess call result
    """
    build_js_frontend()
    build_py_requirements()
    cmd = "docker-compose down && docker-compose build"
    return subprocess.call(cmd, shell=True)
