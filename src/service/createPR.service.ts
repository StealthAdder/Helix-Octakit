import { ICreatePRParams } from "../types/index.type";

const createPR = async (params: ICreatePRParams) => {
  const { octokit, repo, owner, title, body, head, base } = params;
  await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    title,
    body,
    head,
    base,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}

export default createPR;