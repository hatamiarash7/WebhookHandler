FROM node:19-alpine

ARG DATE_CREATED

LABEL maintainer="Arash Hatami <hatamiarash7@gmail.com>"
LABEL org.opencontainers.image.created=$DATE_CREATED
LABEL org.opencontainers.image.authors="hatamiarash7"
LABEL org.opencontainers.image.vendor="hatamiarash7"
LABEL org.opencontainers.image.title="Webhook Handler"
LABEL org.opencontainers.image.description="A Webhook Handler for Github, Gitlab and other platforms"
LABEL org.opencontainers.image.source="https://github.com/hatamiarash7/WebhookHandler"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD [ "node", "hook.js" ]