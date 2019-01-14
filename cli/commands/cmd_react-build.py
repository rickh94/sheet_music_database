import click

from cli.commands.build_frontend import build_js_frontend


@click.command()
def cli():
    """
    Start the docker container

    :return: Subprocess call result
    """
    build_js_frontend()
