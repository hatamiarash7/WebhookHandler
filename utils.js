module.exports = {
  getHeader: function (provider) {
    switch (provider) {
      case "github":
        return "X-Hub-Signature";
      case "gitlab":
        return "X-Gitlab-Token";
      case "gogs":
        return "X-Gogs-Signature";
      case "gitea":
        return "HTTP_X_GITEA_SIGNATURE";
      default:
        return "error";
    }
  }
};
