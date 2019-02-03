down:
    docker-compose down

up:
    docker-compose up -d

build:
    pipenv run smdb build

restart container:
    docker-compose restart {{container}}

logs container:
    docker-compose logs {{container}}

generate-client host:
    pipenv run smdb manage make_js_interface {{host}} api.js
    mv backend/app/api.js frontend/middleware/api.js
