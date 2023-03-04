import { App } from '@octokit/app';
import { Webhooks, createNodeMiddleware } from '@octokit/webhooks'
import express, { Request, Response } from 'express';
import config from './config';
import morgan from 'morgan';

(async () => {
  const server = express();
  server.use(morgan('dev'));
  const app = new App({
    appId: config.APP_ID,
    privateKey: config.APP_PRIVATE_KEY,
    oauth: {
      clientId: '0',
      clientSecret: '0',
    },
    webhooks: {
      secret: config.WEBHOOK_SECRET,
    },
  });

  const { data } = await app.octokit.request('/app');
  console.log('authenticated as %s', data.name);
  server.use(express.json());
  const middleware = createNodeMiddleware(app.webhooks, { path: '/' });
  server.use(middleware);

  server.get('/', (req, res) => {
    return res.status(200);
  });

  server.post('/', (req, res) => {
    console.log('clg:', req.body);
    return res.status(200).json({ msg: 'test successful' });
  });

  app.webhooks.onAny(({ id, name, payload }) => {
    console.log(name, 'event received');
  });

  app.webhooks.on("pull_request.opened", async ({ id, name, octokit, payload }) => {
    console.log(name, 'event received', id, 'event id');
    console.log(JSON.stringify(payload));

    // await octokit.request(
    //   "POST /repos/{owner}/{repo}/pulls/comments/",
    //   {

    //   }
    // );
  });

  app.webhooks.on("pull_request.closed", async ({ id, name, octokit, payload }) => {
    console.log(name, 'event received', id, 'event id');
    // console.log(JSON.stringify(payload));

    // await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    //   owner: 'OWNER',
    //   repo: 'REPO',
    //   title: 'staging -> main | Bot PR',
    //   body: 'Please pull these awesome changes in!',
    //   head: 'development',
    //   base: 'staging',
    //   headers: {
    //     'X-GitHub-Api-Version': '2022-11-28'
    //   }
    // })
  });

  app.webhooks.on("pull_request.reopened", ({ id, name, octokit, payload }) => {
    console.log(name, 'event received', id, 'event id');
    console.log(JSON.stringify(payload));
    // await octokit
  });

  server.listen(3000, () => {
    console.log('server listening on port 3000 - app one');
  });
})();
