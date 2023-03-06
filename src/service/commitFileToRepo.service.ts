/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
// import { Octokit } from "@octokit/core";

const commitFileToRepo = async (filePath: string, fileSha: string) => {
  fs.readFile(filePath, (err: any, data: any) => {
    if (err) console.error(err);

    const base64Data = data.toString('base64');

    console.log('bassae', base64Data);
    console.log('fileSha', fileSha);
  })
  // await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
  //   owner: 'OWNER',
  //   repo: 'REPO',
  //   path: 'PATH',
  //   message: 'a new commit message',
  //   committer: {
  //     name: 'Monalisa Octocat',
  //     email: 'octocat@github.com'
  //   },
  //   content: 'bXkgdXBkYXRlZCBmaWxlIGNvbnRlbnRz',
  //   sha: '95b966ae1c166bd92f8ae7d1c313e738c731dfc3',
  //   headers: {
  //     'X-GitHub-Api-Version': '2022-11-28'
  //   }
  // })
  return null;
}

export default commitFileToRepo;