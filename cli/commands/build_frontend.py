import os
import subprocess
from pathlib import Path

from dotenv import load_dotenv


def build_js_frontend():
    load_dotenv()
    PROJECT_ROOT = os.environ.get("PROJECT_ROOT", "")
    frontend_dir = Path(PROJECT_ROOT) / "frontend"
    subprocess.run(["yarn", "build"], cwd=frontend_dir)
