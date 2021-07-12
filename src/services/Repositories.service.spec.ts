import { mockPullRequest } from '../../test/mockData';
import { queryMock } from '../../test/queryMock';
import { MergeableState, PullRequestState } from '../constants';
import { GRAPHQL_GITHUB_API_URL, PULL_REQUEST_QUERY_NAME } from '../graphql';
import { RepositoriesService } from './Repositories.service';

describe('RepositoriesService', () => {
  const service = new RepositoriesService('token');

  beforeAll(() => {
    queryMock.setup(GRAPHQL_GITHUB_API_URL);
  });

  afterEach(() => {
    queryMock.reset();
  });

  afterAll(() => {
    queryMock.cleanup();
  });

  describe('getPullRequest', () => {
    const owner = 'octokit';
    const repo = 'graphql';
    const pullRequestNumber = 4;

    it('should throw if graphql errors', async () => {
      queryMock.mockQuery({
        name: PULL_REQUEST_QUERY_NAME,
        variables: { owner, repo, pullRequestNumber },
        data: {},
        graphqlErrors: [{ type: 'ERROR', message: '' }],
      });

      await expect(
        service.getPullRequest(owner, repo, pullRequestNumber)
      ).rejects.toThrowError();
    });

    it('should return pull request', async () => {
      queryMock.mockQuery({
        name: PULL_REQUEST_QUERY_NAME,
        variables: { owner, repo, pullRequestNumber },
        data: {
          repository: {
            pullRequest: {
              id: '4',
              author: { login: 'author' },
              title: 'Pull request #4',
              labels: { nodes: [{ name: 'foo' }, { name: 'bar' }] },
              isDraft: false,
              checksUrl: 'https://domain.com/pull/4/checks',
              state: PullRequestState.open,
              mergeable: MergeableState.mergeable,
            },
          },
        },
      });

      await expect(
        service.getPullRequest(owner, repo, pullRequestNumber)
      ).resolves.toEqual(mockPullRequest(`${pullRequestNumber}`));
    });
  });
});
