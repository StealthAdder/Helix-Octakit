import { App, createNodeMiddleware } from '@octokit/app';
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
      secret: '0',
    },
  });

  const { data } = await app.octokit.request('/app');
  console.log('authenticated as %s', data.name);

  server.use(express.json());
  // server.use(createNodeMiddleware(app));

  // app.webhooks.onAny(({ id, name, payload }) => {
  //   console.log(name, 'event received');
  //   console.log(id, name, payload);
  // });

  app.webhooks.on('ping', ({ id, name, octokit, payload }) => {
    console.log(id, name, payload, octokit);
  });

  server.get('/', (req: Request, res: Response) => {
    console.log(req.path);
    res.status(200).json({
      msg: 'hello world',
    });
  });

  server.post('/', (req: Request, res: Response) => {
    // const { pull_request, action } = req.body as IRequestBodyType;

    // const { assignee, head, base } = pull_request;
    // const { login } = assignee;

    // console.log(login);
    console.log('clg: ', req.body);

    return res.status(200).json({ msg: 'test successful' });
  });

  server.listen(3000, () => {
    console.log('server listening on port');
  });
})();
