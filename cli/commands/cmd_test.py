import subprocess

import click


@click.command()
@click.option("-v", "--verbose", is_flag=True)
@click.option("--cov", is_flag=True)
@click.option("--picked", is_flag=True)
@click.option("-m", "--multi-thread", is_flag=True)
def cli(verbose, cov, picked, multi_thread):
    """
    Run tests

    :return: Subprocess call result
    """
    pytest_options = ["--instafail"]
    if verbose:
        pytest_options.append("-v")
    if cov:
        pytest_options.append("--cov=.")
    if picked:
        pytest_options.append("--picked")
    if multi_thread:
        pytest_options.append("-n 8")

    sub_cmd = [
        "pytest",
        *pytest_options,
        "--disable-pytest-warnings",
        "&&",
        "flake8",
        "&&",
        "isort */**.py",
    ]
    subprocess.Popen(["black", "."])
    sub_cmd_str = " ".join(sub_cmd)
    cmd = ["docker-compose", "run", "--rm", "backend-app", "sh", f'-c "{sub_cmd_str}"']
    return subprocess.call(" ".join(cmd), shell=True)
