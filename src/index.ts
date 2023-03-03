import { Webhooks, createNodeMiddleware } from '@octokit/webhooks';
import config from './config';
import express from 'express';

(async () => {
  const server = express();
  const webhooks = new Webhooks({
    secret: config.WEBHOOK_SECRET,
  });

  server.use(express.json());
  const middleware = createNodeMiddleware(webhooks, { path: '/' });
  server.use(middleware);

  server.get('/', (req, res) => {
    return res.status(200);
  });

  server.post('/', (req, res) => {
    console.log('clg:', req.body);
    return res.status(200).json({ msg: 'test successful' });
  });

  webhooks.onAny(({ id, name, payload }) => {
    console.log(name, 'event received');
  });

  server.listen(3000, () => {
    console.log('server listening on port 3000');
  });
})();
