# Webhook Handler

[![GitHub license](https://img.shields.io/github/license/hatamiarash7/WebhookHandler)](https://github.com/hatamiarash7/WebhookHandler/blob/master/LICENSE) ![Github](https://github.com/hatamiarash7/WebhookHandler/workflows/Github/badge.svg) ![Dockerhub](https://github.com/hatamiarash7/WebhookHandler/workflows/Dockerhub/badge.svg) ![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/hatamiarash7/webhook)

A Webhook Handler for Github, Gitlab, ...

## Configure

You need to set a env variables for using webhooks. Create a `.env` like this :

```env
SECRET=changeme

DB_CONNECTION="mongodb://localhost:27017/webhook"

# Github:  X-Hub-Signature
# Gitlab:  X-Gitlab-Token
# Gogs:    X-Gogs-Signature
# Gitea:   HTTP_X_GITEA_SIGNATURE
SIGNATURE="X-Hub-Signature"
```

Use `SECRET` value in github settings :

![secret](.github/secret.png)

## Run

```bash
npm install
node hook.js
```

Or use docker

```bash
docker pull hatamiarash7/webhook
docker run -d
    -p 49160:3000
    -e SECRET='changeme'
    -e DB_CONNECTION='mongodb://localhost:27017/webhook'
    -e SIGNATURE='X-Hub-Signature'
    hatamiarash7/webhook
```

## ToDo

- [ ] Connect to DB
