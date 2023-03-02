interface IPullRequestType {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  user: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean
  };
  body: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string;
  assignee: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean
  };
  assignees: [
    [
      null
    ]
  ];
  requested_reviewers: [];
  requested_teams: [];
  labels: [
    [
      null
    ]
  ];
  milestone: string | null;
  draft: boolean;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  head: {
    label: string;
    ref: string;
    sha: string;
    user: [
      null
    ];
    repo: [
      null
    ]
  };
  base: {
    label: string;
    ref: string;
    sha: string;
    user: [
      null
    ];
    repo: [
      null
    ]
  };
  _links: {
    self: [
      null
    ];
    html: [
      null
    ];
    issue: [
      null
    ];
    comments: [
      null
    ];
    review_comments: [
      null
    ];
    review_comment: [
      null
    ];
    commits: [
      null
    ];
    statuses: [
      null
    ]
  };
  author_association: string;
  auto_merge: null;
  active_lock_reason: null;
  merged: boolean;
  mergeable: null;
  rebaseable: null;
  mergeable_state: string;
  merged_by: null;
  comments: number;
  review_comments: number;
  maintainer_can_modify: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number
}

export default IPullRequestType;