import { App } from '@octokit/app';
import { createNodeMiddleware } from '@octokit/webhooks'
import express, { Request, Response } from 'express';
import config from './config';
import morgan from 'morgan';
import getFile from './service/getFile.service';
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

  app.webhooks.on("pull_request.closed", async ({ id, name, octokit, payload }) => {
    console.log(name);
    console.log(id);
    const { pull_request } = payload;
    const { merged, labels } = pull_request;

    if (merged && labels[0].name === "dev -> staging") {
      const fileName = 'package.json';
      const branchName = 'staging';
      const filePath = `./src/dump/${fileName}`

      const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        path: fileName,
        ref: branchName,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;

      if (data.download_url) {
        await getFile(String(data.download_url), filePath, async () => {
          await bumpVersion(branchName, filePath);
          await commitFileToRepo({
            filePath,
            octokit,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            path: fileName,
            branchName,
            sha: data.sha
          });
        });
      }
    }
  })

  // app.webhooks.onAny(({ id, name, payload }) => {
  //   console.log(name, 'event received');
  //   console.log(JSON.stringify(payload));
  // });

  server.listen(3000, () => {
    console.log('server listening on port 3000 - app one');
  });
})();
