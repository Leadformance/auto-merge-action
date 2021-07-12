export const MERGE_PULL_REQUEST_NAME = 'MergePullRequest';

export const MERGE_PULL_REQUEST = `
  mutation ${MERGE_PULL_REQUEST_NAME}(
    $pullRequestId: ID!,
    $mergeMethod: PullRequestMergeMethod!,
  ) {
    mergePullRequest(input: {
      pullRequestId: $pullRequestId,
      mergeMethod: $mergeMethod,
    }) {
      pullRequest {
        state
      }
    }
  }`;
