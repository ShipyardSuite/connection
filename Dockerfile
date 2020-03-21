FROM node:8-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install

ARG CACHEBUST=1
CMD [ "npm", "start" ]

EXPOSE 8080