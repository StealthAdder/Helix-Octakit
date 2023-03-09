import { IDeleteBranchParams } from "../types/index.type";

const deleteBranch = async (params: IDeleteBranchParams) => {
  const { branchName, octokit, owner, repo } = params;

  await octokit.request("DELETE /repos/{owner}/{repo}/git/refs/heads/{ref}", {
    owner,
    repo,
    ref: branchName
  });
}

export default deleteBranch;