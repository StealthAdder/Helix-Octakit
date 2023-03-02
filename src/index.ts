import http from 'http';
import { App, createNodeMiddleware } from "@octokit/app";

(async () => {
  const app = new App({
    appId: 123,
    privateKey: "-----BEGIN PRIVATE KEY-----\n...",
    oauth: {
      clientId: "0123",
      clientSecret: "0123secret",
    },
    webhooks: {
      secret: "secret",
    },
  });

  const { data } = await app.octokit.request("/app");
  console.log("authenticated as %s", data.name);
  for await (const { installation } of app.eachInstallation.iterator()) {
    for await (const { octokit, repository } of app.eachRepository.iterator({
      installationId: installation.id,
    })) {
      await octokit.request("POST /repos/{owner}/{repo}/dispatches", {
        owner: repository.owner.login,
        repo: repository.name,
        event_type: "my_event",
      });
    }
  }

  app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.issue.number,
        body: "Hello World!",
      }
    );
  });

  app.oauth.on("token", async ({ token, octokit }) => {
    const { data } = await octokit.request("GET /user");
    console.log(`Token retrieved for ${data.login}`);
  });

  http.createServer(createNodeMiddleware(app)).listen(3000);
  // can now receive requests at /api/github/*
})()