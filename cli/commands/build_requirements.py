import os
import subprocess
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()
PROJECT_ROOT = os.environ.get("PROJECT_ROOT", "")


def build_py_requirements():
    """Builds the requirements.pip for a project based on the Pipfile
    in the configured PROJECT_ROOT.

    :return: path to newly created requirements file
    """

    result_main = subprocess.run(
        ["pipenv", "lock", "-r", "--pre"], cwd=PROJECT_ROOT, stdout=subprocess.PIPE
    )
    result_dev = subprocess.run(
        ["pipenv", "lock", "--dev", "-r", "--pre"],
        cwd=PROJECT_ROOT,
        stdout=subprocess.PIPE,
    )
    text = b"".join([result_main.stdout, result_dev.stdout])
    requirements = Path(PROJECT_ROOT) / "requirements.pip"
    with requirements.open("wb") as req:
        req.write(text)
    return requirements
