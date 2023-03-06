import { App } from '@octokit/app';
import { createNodeMiddleware } from '@octokit/webhooks'
import express, { Request, Response } from 'express';
import config from './config';
import morgan from 'morgan';
import getFile from './service/getFile.service';
import { OctokitResponse } from '@octokit/types';
import bumpVersion from './service/bumpVersion.service';
import commitFileToRepo from './service/commitFileToRepo.service';

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

  server.post('/', (req: Request, res: Response) => {
    console.log('clg:', req.body);
    return res.status(200).json({ msg: 'test successful' });
  });

  app.webhooks.on("pull_request.opened", async ({ id, name, octokit, payload }) => {
    console.log(name, 'event received', id, 'event id');
    console.log(JSON.stringify(payload));


    const data = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      path: 'package.json',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    console.log(JSON.stringify(data));
  });

  app.webhooks.on("pull_request.closed", async ({ id, name, octokit, payload }) => {
    console.log(name, 'event received', id, 'event id');
    // console.log(JSON.stringify(payload));

    const fileName = 'package.json';

    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      path: fileName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    console.log(data.download_url);
    console.log(data);

    if (data.download_url) {
      await getFile(String(data.download_url), `./src/dump/${fileName}`, async () => {
        await bumpVersion('main', `./src/dump/${fileName}`);
        await commitFileToRepo(`./src/dump/${fileName}`, data.sha);
      });
    }
  });

  app.webhooks.on("pull_request.reopened", async ({ id, name, octokit, payload }) => {
    console.log(name, 'event received', id, 'event id');
    // console.log(JSON.stringify(payload));

    const fileName = 'package.json';

    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      path: fileName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    console.log(data.download_url);
    console.log(data);

    if (data.download_url) {
      await getFile(String(data.download_url), `./src/dump/${fileName}`, async () => {
        await bumpVersion('main', `./src/dump/${fileName}`);
        await commitFileToRepo(`./src/dump/${fileName}`, data.sha);
      });
    }
  });

  app.webhooks.onAny(({ id, name, payload }) => {
    console.log(name, 'event received');
  });

  server.listen(3000, () => {
    console.log('server listening on port 3000 - app one');
  });
})();
