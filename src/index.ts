import { App } from '@octokit/app';
import { createNodeMiddleware } from '@octokit/webhooks'
import express, { Request, Response } from 'express';
import config from './config';
import morgan from 'morgan';
import getFile from './service/getFile.service';
import bumpVersion from './service/bumpVersion.service';
import commitFileToRepo from './service/commitFileToRepo.service';
import createNewBranch from './service/createNewBranch.service';
import getBranch from './service/getBranch.service';
import updatePR from './service/updatePR.service';
import deleteBranch from './service/deleteBranch.service';
import createPR from './service/createPR.service';

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
    const { merged, labels, base, number, merged_by, title, head } = pull_request;

    // delete the branch if it exists
    if (merged === false) {
      // check if it is a restricted branch before deleting.
      if (config.RESTRICTED_BRANCHES.includes(base.ref)) {
        console.log('base was a restricted branch so will not be deleted');
        return;
      }

      // if not delete the base branch in PR
      await deleteBranch({
        branchName: base.ref,
        octokit,
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
      });
      console.log('exited - PR was not merged so deleted the branch when PR closed')
      return;
    }

    if (merged && title.startsWith('Automated PR')) {
      if (config.RESTRICTED_BRANCHES.includes(head.ref)) {
        console.log('head was a restricted branch so will not be deleted');
        return;
      }
      // delete the branch temp branch
      await deleteBranch({
        branchName: head.ref,
        octokit,
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
      });
      console.log('exited - PR was merged so the branch will be deleted')
      return;
    }

    if (config.RESTRICTED_BRANCHES.includes(head.ref) && config.RESTRICTED_BRANCHES.includes(base.ref)) {
      console.log('no version bump - RESTRICTED_BRANCHES');
      return;
    }

    if (merged && labels[0].name === "development-pr") {
      const fileName = 'package.json';
      // const branchName = 'staging';
      const filePath = `./src/dump/${fileName}`

      const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        path: fileName,
        ref: base.ref,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;

      if (data.download_url) {
        await getFile(String(data.download_url), filePath, async () => {
          await bumpVersion(base.ref, filePath);
          await commitFileToRepo({
            filePath,
            octokit,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            path: fileName,
            branchName: base.ref,
            sha: data.sha
          });

          // create a new PR from base.ref to development
          await createPR({
            octokit,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            head: base.ref,
            base: 'development',
            body: `Auto-Generated PR \nThis PR was created because PR-#${number} was successfully merged by ${merged_by?.login}`,
            title: `Automated PR ${number} | ${base.ref} -> development`
          });
        });
      }
    }
  });

  app.webhooks.on("pull_request.opened", async ({ id, name, octokit, payload }) => {
    console.log(name);

    const { pull_request } = payload;

    const { labels, base, head, title } = pull_request;

    if (title.startsWith('Automated PR')) {
      console.log('exited - ignored')
      return;
    }

    if (labels[0]?.name !== 'development-pr') {
      console.log('exited - ignored');
      return;
    }

    if (config.RESTRICTED_BRANCHES.includes(head.ref) && config.RESTRICTED_BRANCHES.includes(base.ref)) {
      console.log('exited - RESTRICTED_BRANCHES');
      return;
    }

    // create new branch from development;
    const { commit } = await getBranch({
      branch: 'development',
      octokit,
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
    });

    await createNewBranch({
      octokit,
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      sha: commit.sha,
      headName: head.ref,
      prNumber: String(pull_request.number)
    });

    // update the PR to change base branch
    await updatePR({
      headName: head.ref,
      octokit,
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pull_number: String(pull_request.number)
    });
  });

  // app.webhooks.onAny(({ id, name, payload }) => {
  //   console.log(name, 'event received');
  //   console.log(JSON.stringify(payload));
  // });

  server.listen(3000, () => {
    console.log('server listening on port 3000 - app one');
  });
})();
