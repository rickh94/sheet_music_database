import subprocess

import click


@click.command()
def cli():
    """
    Shut down docker containers

    :return: Subprocess call result
    """
    cmd = "docker-compose down"
    return subprocess.call(cmd, shell=True)
