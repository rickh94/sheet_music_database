import subprocess

import click


@click.command()
@click.option("-v", "--verbose", is_flag=True)
@click.option("--cov", is_flag=True)
@click.option("--picked", is_flag=True)
def cli(verbose, cov, picked):
    """
    Run tests

    :return: Subprocess call result
    """
    pytest_options = ["--instafail"]
    if verbose:
        pytest_options += "-v"
    if cov:
        pytest_options += "--cov=."
    if picked:
        pytest_options += "--picked"

    sub_cmd = [
        "pytest",
        *pytest_options,
        "--disable-pytest-warnings",
        "&&",
        "flake8",
        "&&",
        "isort */**.py",
    ]
    sub_cmd_str = " ".join(sub_cmd)
    cmd = ["docker-compose", "run", "--rm", "backend-app", "sh", f'-c "{sub_cmd_str}"']
    return subprocess.call(" ".join(cmd), shell=True)
