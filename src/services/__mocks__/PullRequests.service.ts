import { mockPullRequest } from '../../../test/mockData';
import { AutoMergeRequest, PullRequest, PullRequestReview } from '../../@types';
import { PullRequestState } from '../../constants';

export class PullRequestsService {
  public async markPullRequestReadyForReview(
    pullRequestId: string
  ): Promise<Pick<PullRequest, 'isDraft'>> {
    return new Promise(resolve => {
      const pullRequest = mockPullRequest(pullRequestId);
      resolve({ isDraft: pullRequest.isDraft || false });
    });
  }

  public async addPullRequestReview(
    pullRequestId: string
  ): Promise<PullRequestReview> {
    return new Promise(resolve => {
      resolve({ url: `https://domain.com/pull/${pullRequestId}/review` });
    });
  }

  public async enablePullRequestAutoMerge(): Promise<AutoMergeRequest> {
    return new Promise(resolve => {
      resolve({ enabledAt: new Date() });
    });
  }

  public async mergePullRequest(): Promise<Pick<PullRequest, 'state'>> {
    return new Promise(resolve => {
      resolve({ state: PullRequestState.merged });
    });
  }
}
