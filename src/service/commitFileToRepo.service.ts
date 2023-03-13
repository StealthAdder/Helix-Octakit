/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

import { ICommitFileToRepoParams } from '../types/index.type';

// filePath: string, fileSha: string, octokit: Octokit, payload: any, fileName: string
const commitFileToRepo = async (params: ICommitFileToRepoParams): Promise<boolean> => {
  const { octokit, owner, repo, path, sha, filePath, branchName } = params;
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, async (err: any, data: any) => {
      if (err) reject(false);

      const base64Data = data.toString('base64');
      const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: 'version bump - merged PR - BOT',
        content: base64Data,
        sha,
        branch: branchName,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      console.log(response);

      fs.unlink(filePath, (err: any) => {
        if (err) reject(false);
        resolve(true);
      })
    });
  });
}

export default commitFileToRepo;