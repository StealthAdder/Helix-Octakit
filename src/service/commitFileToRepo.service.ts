/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import { Octokit } from "@octokit/core";

const commitFileToRepo = async (filePath: string, fileSha: string, octokit: Octokit, payload: any, fileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, async (err: any, data: any) => {
      if (err) reject(err);

      const base64Data = data.toString('base64');

      const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        path: fileName,
        message: 'bot - committed - package.json',
        content: base64Data,
        sha: fileSha,
        branch: 'development',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      console.log(response);
      resolve();
    });
  });
}

export default commitFileToRepo;