export const ADD_PULL_REQUEST_REVIEW_MUTATION_NAME = 'AddPullRequestReview';

export const ADD_PULL_REQUEST_REVIEW_MUTATION = `
  mutation ${ADD_PULL_REQUEST_REVIEW_MUTATION_NAME}(
    $pullRequestId: ID!,
    $event: PullRequestReviewEvent!,
    $body: String,
  ) {
    addPullRequestReview(input: {
      event: $event,
      pullRequestId: $pullRequestId,
      body: $body,
    }) {
      pullRequestReview {
        url
      }
    }
  }`;
