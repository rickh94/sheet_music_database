FROM python:3.7-alpine
LABEL maintainer="Rick Henry"

ENV PYTHONUNBUFFERED 1

COPY ./requirements.pip /requirements.pip

RUN apk add --update --no-cache postgresql-client
RUN apk add --update --no-cache --virtual .tmp-build-deps\
    gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev libffi-dev python3-dev

RUN pip install -r /requirements.pip

RUN apk del .tmp-build-deps

RUN mkdir /app
WORKDIR /app

RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static
RUN adduser -D user
RUN chown -R user:user /vol/
RUN chmod -R a+rX /vol/web
RUN chmod -R u+w /vol/web
USER user
