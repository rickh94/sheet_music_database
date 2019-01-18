import subprocess

import click

from cli.commands.build_requirements import build_py_requirements


@click.command()
def cli():
    """
    Start the docker container

    :return: Subprocess call result
    """
    build_py_requirements()

