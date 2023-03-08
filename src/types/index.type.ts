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

export interface ICreateNewBranchParams {
  octokit: Octokit;
  owner: string;
  repo: string;
  sha: string;
  headName: string;
  prNumber: string;
}

export interface IGetBranchParams {
  octokit: Octokit;
  owner: string;
  repo: string;
  branch: string;
}

export interface IUpdatePRParams {
  octokit: Octokit;
  owner: string;
  repo: string;
  pull_number: string;
  headName: string;
}