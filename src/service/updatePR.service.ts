import { IUpdatePRParams } from "../types/index.type";

const updatePR = async (params: IUpdatePRParams) => {
  const { octokit, owner, repo, pull_number, headName } = params;

  await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
    owner,
    repo,
    pull_number: Number(pull_number),
    base: `${repo}-${pull_number}-${headName}`,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
}

export default updatePR;