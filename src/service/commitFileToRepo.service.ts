/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import { Octokit } from "@octokit/core";

const commitFileToRepo = async (filePath: string, fileSha: string, octokit: Octokit, payload: any, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, async (err: any, data: any) => {
      if (err) reject(err);

      const base64Data = data.toString('base64');

      console.log('bassae', base64Data);
      console.log('fileSha', fileSha);
      // const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      //   owner: payload.repository.owner.login,
      //   repo: payload.repository.name,
      //   path: fileName,
      //   message: 'commit yo',
      //   content: base64Data,
      //   sha: fileSha,
      //   headers: {
      //     'X-GitHub-Api-Version': '2022-11-28'
      //   }
      // });
      resolve(base64Data);
    });
  });
}

export default commitFileToRepo;