import { App, createNodeMiddleware } from "@octokit/app";
import express, { Request, Response } from "express";
import config from "./config";
import morgan from "morgan";
import IRequestBodyType from "./types/body.type";

(async () => {
  const server = express();
  server.use(morgan('dev'));
  const app = new App({
    appId: config.APP_ID,
    privateKey: config.APP_PRIVATE_KEY,
    oauth: {
      clientId: "0",
      clientSecret: "0",
    },
    webhooks: {
      secret: config.WEBHOOK_SECRET,
    },
  });

  const { data } = await app.octokit.request("/app");
  console.log("authenticated as %s", data.name);


  server.use(express.json());
  server.use(createNodeMiddleware(app));

  app.webhooks.onAny(({ id, name, payload }) => {
    console.log(name, "event received");
    console.log(id, name, payload);
  });

  server.get('/', (req: Request, res: Response) => {
    console.log(req.path);
    res.status(200).json({
      msg: "hello world"
    })
  })

  server.post('/', (req: Request, res: Response) => {
    const {
      pull_request, action
    } = req.body as IRequestBodyType;

    const { assignee, head, base } = pull_request;
    const { login } = assignee;

    // console.log({
    //   action,
    //   login,
    //   head,
    //   base
    // });
    res.status(200)
  });

  server.listen(3000, () => {
    console.log("server listening on port")
  })
})();