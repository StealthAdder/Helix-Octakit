/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

import { ICommitFileToRepoParams } from '../types/index.type';

// filePath: string, fileSha: string, octokit: Octokit, payload: any, fileName: string
const commitFileToRepo = async (params: ICommitFileToRepoParams): Promise<boolean> => {
  const { octokit, owner, repo, path, sha, filePath } = params;
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, async (err: any, data: any) => {
      if (err) reject(false);

      const base64Data = data.toString('base64');
      const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: 'bot - committed - package.json',
        content: base64Data,
        sha,
        branch: 'development',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      console.log(response);
      resolve(true);
    });
  });
}

export default commitFileToRepo;