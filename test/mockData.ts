import { PullRequest, Team } from '../src/@types';
import { MergeableState, PullRequestState } from '../src/constants';

const mockPullRequestBase: PullRequest = {
  id: '4',
  author: { login: 'author' },
  title: 'Pull request #4',
  labels: [{ name: 'foo' }, { name: 'bar' }],
  isDraft: false,
  checksUrl: 'https://domain.com/pull/4/checks',
  state: PullRequestState.open,
  mergeable: MergeableState.mergeable,
};

const mockPullRequests: PullRequest[] = [
  mockPullRequestBase,
  {
    ...mockPullRequestBase,
    id: '5',
    title: 'Pull request #5',
    mergeable: MergeableState.conflicting,
  },
  {
    ...mockPullRequestBase,
    id: '6',
    title: 'Pull request #6',
    mergeable: MergeableState.unknown,
  },
  {
    ...mockPullRequestBase,
    id: '7',
    title: 'Pull request #7',
    state: PullRequestState.closed,
  },
];

export const mockPullRequest = (pullRequestId: string): PullRequest => {
  const pullRequest = mockPullRequests.find(({ id }) => id === pullRequestId);
  if (!pullRequest) throw new Error('Mock pull request not found');

  return pullRequest;
};

const mockTeams: Array<Team & { name: string }> = [
  { name: '@foo/bar', members: [{ login: 'foo' }, { login: 'bar' }] },
  { name: '@org/team', members: [{ login: 'author' }] },
];

export const mockTeam = (teamName: string): Team => {
  const team = mockTeams.find(({ name }) => name === teamName);
  if (!team) throw new Error('Mock team not found');

  return { members: team.members };
};
