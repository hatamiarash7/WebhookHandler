# Webhook Handler

[![GitHub license](https://img.shields.io/github/license/hatamiarash7/WebhookHandler)](https://github.com/hatamiarash7/WebhookHandler/blob/master/LICENSE) ![Github](https://github.com/hatamiarash7/WebhookHandler/workflows/Github/badge.svg) ![Dockerhub](https://github.com/hatamiarash7/WebhookHandler/workflows/Dockerhub/badge.svg) ![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/hatamiarash7/webhook)

A Webhook Handler for Github

## Configure

You need to set a decret for using webhooks. Create a `.env` like this :

```env
SECRET=changeme
```

Use this value in github settings :

![secret](https://github-images.s3.amazonaws.com/enterprise/2.16/assets/images/enterprise/site-admin-settings/add-global-webhook-secret.png)

## Run

```bash
npm install
node hook.js
```

Or use docker

```bash
docker pull hatamiarash7/webhook
docker run -p 49160:3000 -d hatamiarash7/webhook
```
