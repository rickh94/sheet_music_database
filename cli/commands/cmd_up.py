import os
import subprocess
from pathlib import Path

import click
from dotenv import load_dotenv

from cli.commands.build_frontend import build_js_frontend
from cli.commands.build_requirements import build_py_requirements

load_dotenv()
PROJECT_ROOT = os.environ.get("PROJECT_ROOT", "")


@click.command()
@click.option("--build-frontend", is_flag=True)
def cli(build_frontend):
    """
    Start the docker container

    :return: Subprocess call result
    """
    if build_frontend:
        build_js_frontend()

    requirements = Path(PROJECT_ROOT) / "requirements.pip"
    if not requirements.exists():
        build_py_requirements()

    cmd = "docker-compose up -d"
    return subprocess.call(cmd, shell=True)
