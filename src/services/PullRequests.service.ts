import {
  AddPullRequestReviewMutationData,
  AutoMergeRequest,
  EnablePullRequestAutoMergeMutationData,
  MarkPullRequestReadyForReviewMutationData,
  MergePullRequestMutationData,
  PullRequest,
  PullRequestReview,
} from '../@types';
import { AutoMergeRequestAdapter } from '../adapters';
import { MergeMethod, PullRequestReviewEvent } from '../constants';
import {
  ADD_PULL_REQUEST_REVIEW_MUTATION,
  ENABLE_PULL_REQUEST_AUTO_MERGE_MUTATION,
  MARK_PULL_REQUEST_READY_FOR_REVIEW_MUTATION,
  MERGE_PULL_REQUEST,
} from '../graphql';
import { AbstractGraphQLService } from './AbstractGraphQL.service';

export class PullRequestsService extends AbstractGraphQLService {
  public async markPullRequestReadyForReview(
    pullRequestId: string
  ): Promise<Pick<PullRequest, 'isDraft'>> {
    const data = await this.graphql<MarkPullRequestReadyForReviewMutationData>(
      MARK_PULL_REQUEST_READY_FOR_REVIEW_MUTATION,
      { pullRequestId }
    );

    return data.markPullRequestReadyForReview.pullRequest;
  }

  public async addPullRequestReview(
    pullRequestId: string,
    event: PullRequestReviewEvent,
    body?: string
  ): Promise<PullRequestReview> {
    const data = await this.graphql<AddPullRequestReviewMutationData>(
      ADD_PULL_REQUEST_REVIEW_MUTATION,
      { pullRequestId, event, body }
    );

    return data.addPullRequestReview.pullRequestReview;
  }

  public async enablePullRequestAutoMerge(
    pullRequestId: string,
    mergeMethod: MergeMethod = MergeMethod.rebase
  ): Promise<AutoMergeRequest> {
    const data = await this.graphql<EnablePullRequestAutoMergeMutationData>(
      ENABLE_PULL_REQUEST_AUTO_MERGE_MUTATION,
      { pullRequestId, mergeMethod }
    );

    return AutoMergeRequestAdapter.fromDto(
      data.enablePullRequestAutoMerge.pullRequest.autoMergeRequest
    );
  }

  public async mergePullRequest(
    pullRequestId: string,
    mergeMethod: MergeMethod = MergeMethod.rebase
  ): Promise<Pick<PullRequest, 'state'>> {
    const data = await this.graphql<MergePullRequestMutationData>(
      MERGE_PULL_REQUEST,
      {
        pullRequestId,
        mergeMethod,
      }
    );

    return data.mergePullRequest.pullRequest;
  }
}
