import {
  MergeMethod,
  PullRequestReviewEvent,
  PullRequestState,
} from '../constants';
import {
  ADD_PULL_REQUEST_REVIEW_MUTATION_NAME,
  ENABLE_PULL_REQUEST_AUTO_MERGE_MUTATION_NAME,
  GRAPHQL_GITHUB_API_URL,
  MARK_PULL_REQUEST_READY_FOR_REVIEW_MUTATION_NAME,
  MERGE_PULL_REQUEST_NAME,
} from '../graphql';
import { PullRequestsService } from './PullRequests.service';
import { queryMock } from '../../test/queryMock';

describe('PullRequestsService', () => {
  const service = new PullRequestsService('token');

  beforeAll(() => {
    queryMock.setup(GRAPHQL_GITHUB_API_URL);
  });

  afterEach(() => {
    queryMock.reset();
  });

  afterAll(() => {
    queryMock.cleanup();
  });

  describe('markPullRequestReadyForReview', () => {
    const pullRequestId = 'pr-4';

    it('should throw if graphql errors', async () => {
      queryMock.mockQuery({
        name: MARK_PULL_REQUEST_READY_FOR_REVIEW_MUTATION_NAME,
        variables: { pullRequestId },
        data: {},
        graphqlErrors: [{ type: 'ERROR', message: '' }],
      });

      await expect(
        service.markPullRequestReadyForReview(pullRequestId)
      ).rejects.toThrowError();
    });

    it('should return client mutation id', async () => {
      queryMock.mockQuery({
        name: MARK_PULL_REQUEST_READY_FOR_REVIEW_MUTATION_NAME,
        variables: { pullRequestId },
        data: {
          markPullRequestReadyForReview: {
            pullRequest: {
              isDraft: false,
            },
          },
        },
      });

      await expect(
        service.markPullRequestReadyForReview(pullRequestId)
      ).resolves.toEqual({
        isDraft: false,
      });
    });
  });

  describe('addPullRequestReview', () => {
    const pullRequestId = 'pr-4';
    const event = PullRequestReviewEvent.approve;
    const body = 'Comment';

    it('should throw if graphql errors', async () => {
      queryMock.mockQuery({
        name: ADD_PULL_REQUEST_REVIEW_MUTATION_NAME,
        variables: { pullRequestId, event, body },
        data: {},
        graphqlErrors: [{ type: 'ERROR', message: '' }],
      });

      await expect(
        service.addPullRequestReview(pullRequestId, event, body)
      ).rejects.toThrowError();
    });

    it('should return team members login', async () => {
      queryMock.mockQuery({
        name: ADD_PULL_REQUEST_REVIEW_MUTATION_NAME,
        variables: { pullRequestId, event, body },
        data: {
          addPullRequestReview: {
            pullRequestReview: {
              url: 'https://domain.com/pull/4/review',
            },
          },
        },
      });

      await expect(
        service.addPullRequestReview(pullRequestId, event, body)
      ).resolves.toEqual({
        url: 'https://domain.com/pull/4/review',
      });
    });
  });

  describe('mergePullRequest', () => {
    const pullRequestId = 'pr-4';
    const mergeMethod = MergeMethod.rebase;

    it('should throw if graphql errors', async () => {
      queryMock.mockQuery({
        name: MERGE_PULL_REQUEST_NAME,
        variables: { pullRequestId, mergeMethod },
        data: {},
        graphqlErrors: [{ type: 'ERROR', message: '' }],
      });

      await expect(
        service.mergePullRequest(pullRequestId)
      ).rejects.toThrowError();
    });

    it('should return pull request state', async () => {
      queryMock.mockQuery({
        name: MERGE_PULL_REQUEST_NAME,
        variables: { pullRequestId, mergeMethod },
        data: {
          mergePullRequest: {
            pullRequest: {
              state: PullRequestState.merged,
            },
          },
        },
      });

      await expect(
        service.mergePullRequest(pullRequestId, mergeMethod)
      ).resolves.toEqual({
        state: PullRequestState.merged,
      });
    });
  });

  describe('enablePullRequestAutoMerge', () => {
    const pullRequestId = 'pr-4';
    const mergeMethod = MergeMethod.rebase;

    it('should throw if graphql errors', async () => {
      queryMock.mockQuery({
        name: ENABLE_PULL_REQUEST_AUTO_MERGE_MUTATION_NAME,
        variables: { pullRequestId, mergeMethod },
        data: {},
        graphqlErrors: [{ type: 'ERROR', message: '' }],
      });

      await expect(
        service.enablePullRequestAutoMerge(pullRequestId)
      ).rejects.toThrowError();
    });

    it('should return team members login', async () => {
      const date = new Date();

      queryMock.mockQuery({
        name: ENABLE_PULL_REQUEST_AUTO_MERGE_MUTATION_NAME,
        variables: { pullRequestId, mergeMethod },
        data: {
          enablePullRequestAutoMerge: {
            pullRequest: {
              autoMergeRequest: {
                enabledAt: date.toISOString(),
              },
            },
          },
        },
      });

      await expect(
        service.enablePullRequestAutoMerge(pullRequestId, mergeMethod)
      ).resolves.toEqual({
        enabledAt: date,
      });
    });
  });
});
