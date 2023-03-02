import IPullRequestType from "./pull-request.type";

interface IRequestBodyType {
  pull_request: IPullRequestType;
  action: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repository: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sender: any;
}

export default IRequestBodyType;