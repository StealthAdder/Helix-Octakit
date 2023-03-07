/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from "@octokit/core";
export interface ICommitFileToRepoParams {
  octokit: Octokit;
  owner: string;
  repo: string;
  path: string;
  sha: string;
  filePath: string;
  branchName: string;
}