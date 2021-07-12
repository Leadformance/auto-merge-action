import { PullRequestReviewDto } from '../dto';

export interface AddPullRequestReviewMutationData {
  addPullRequestReview: {
    pullRequestReview: PullRequestReviewDto;
  };
}
