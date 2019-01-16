# Sheet Music App
My app for storing and managing my sheet music in the cloud. SPA built with ReactJS and a
Django REST Framework backend.


## Helper script
`setup.py` file installs `smdb` helper script to run docker-compose and yarn commands.
`$ pip install -e .` (in virtualenv) and then `smdb [command]`. `smdb build`, `smdb up` 
to start docker containers.