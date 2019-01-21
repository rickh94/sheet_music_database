import subprocess

import click


@click.command(context_settings={"ignore_unknown_options": True})
@click.argument("command")
@click.argument("arg", nargs=-1)
def cli(command, arg):
    """
    Migrate the database

    :return: Subprocess call result
    """
    arg = " ".join(arg)
    cmd = (
        f'docker-compose run --rm backend-app sh -c "python manage.py {command} {arg}"'
    )
    return subprocess.call(cmd, shell=True)
