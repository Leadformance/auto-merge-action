export const MARK_PULL_REQUEST_READY_FOR_REVIEW_MUTATION_NAME =
  'EnablePullRequestAutoMerge';

export const MARK_PULL_REQUEST_READY_FOR_REVIEW_MUTATION = `
  mutation ${MARK_PULL_REQUEST_READY_FOR_REVIEW_MUTATION_NAME}(
    $pullRequestId: ID!,
  ) {
    markPullRequestReadyForReview(input: {
      pullRequestId: $pullRequestId,
    }) {
      pullRequest {
        isDraft
      }
    }
  }`;
