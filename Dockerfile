FROM node:10-slim

LABEL maintainer="shipyardsuite@gmail.com"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG SERVICE_NAME_ARG=${SERVICE_NAME}
ARG SERVICE_PORT_ARG=${SERVICE_PORT}

ENV SERVICE_NAME=$SERVICE_NAME_ARG
ENV SERVICE_PORT=$SERVICE_PORT_ARG

COPY . /usr/src/app/
RUN npm install

ARG CACHEBUST=1
CMD [ "npm", "start" ]