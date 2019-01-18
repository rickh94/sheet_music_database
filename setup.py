from setuptools import setup

setup(
    name="ContactManage-App-CLI",
    version="1.0",
    packages=["cli", "cli.commands"],
    include_package_data=True,
    install_requires=["click", "python-dotenv"],
    entry_points="""
        [console_scripts]
        smdb=cli.cli:cli
    """,
)
