import { IGetBranchParams } from "../types/index.type";

const getBranch = async (params: IGetBranchParams) => {
  const { branch, octokit, owner, repo } = params;
  const { data, status } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
    owner,
    repo,
    branch,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  return {
    ...data,
    status
  };
}

export default getBranch;