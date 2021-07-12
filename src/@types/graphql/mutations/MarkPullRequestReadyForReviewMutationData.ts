import { PullRequestDto } from '../dto';

export interface MarkPullRequestReadyForReviewMutationData {
  markPullRequestReadyForReview: {
    pullRequest: Pick<PullRequestDto, 'isDraft'>;
  };
}
