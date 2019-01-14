import subprocess

import click


@click.command()
@click.argument("command")
@click.argument("arg")
def cli(command, arg):
    """
    Migrate the database

    :return: Subprocess call result
    """
    cmd = (
        f'docker-compose run --rm backend-app sh -c "python manage.py {command} {arg}"'
    )
    return subprocess.call(cmd, shell=True)
