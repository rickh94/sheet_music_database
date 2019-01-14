import subprocess

import click

from cli.commands.build_frontend import build_js_frontend


@click.command()
@click.option("--build-frontend", is_flag=True)
def cli(build_frontend):
    """
    Start the docker container

    :return: Subprocess call result
    """
    if build_frontend:
        build_js_frontend()

    cmd = "docker-compose up -d"
    return subprocess.call(cmd, shell=True)
