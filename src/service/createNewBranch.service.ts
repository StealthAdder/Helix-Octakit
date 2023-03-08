import { ICreateNewBranchParams } from "../types/index.type";
const createNewBranch = async (params: ICreateNewBranchParams) => {
  const { octokit, owner, repo, sha, headName, prNumber } = params;

  // refs/heads/hari-2
  const { data, status } = await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
    owner,
    repo,
    ref: `refs/heads/${repo}-${prNumber}-${headName}`,
    sha
  });
  return { data, status }
}

export default createNewBranch;