# Webhook Handler

[![GitHub license](https://img.shields.io/github/license/hatamiarash7/WebhookHandler)](https://github.com/hatamiarash7/WebhookHandler/blob/master/LICENSE) ![Github](https://github.com/hatamiarash7/WebhookHandler/workflows/Github/badge.svg) ![Dockerhub](https://github.com/hatamiarash7/WebhookHandler/workflows/Dockerhub/badge.svg) ![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/hatamiarash7/webhook)

A Webhook Handler for Github, Gitlab, .... It's just a simple parser and you should extend this project if you need a visualizer.

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

LOG_LEVEL=info
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
    -e LOG_LEVEL='debug'
    hatamiarash7/webhook
```

![screenshot](.github/screenshot.png)

## To-Do

- [x] Connect to DB
- [ ] Test with git platforms
    - [x] Github
    - [ ] Gitlab
    - [ ] Gitea
    - [ ] Gogs
- [x] Configure a logger

## Support

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D1D1WGU9)

<div><a href="https://payping.ir/@hatamiarash7"><img src="https://cdn.payping.ir/statics/Payping-logo/Trust/blue.svg" height="128" width="128"></a></div>

## Contributing

1. Fork it !
2. Create your feature branch : `git checkout -b my-new-feature`
3. Commit your changes : `git commit -am 'Add some feature'`
4. Push to the branch : `git push origin my-new-feature`
5. Submit a pull request :D

## Issues

Each project may have many problems. Contributing to the better development of this project by reporting them.
