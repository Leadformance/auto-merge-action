export const ENABLE_PULL_REQUEST_AUTO_MERGE_MUTATION_NAME =
  'EnablePullRequestAutoMerge';

export const ENABLE_PULL_REQUEST_AUTO_MERGE_MUTATION = `
  mutation ${ENABLE_PULL_REQUEST_AUTO_MERGE_MUTATION_NAME}(
    $pullRequestId: ID!,
    $mergeMethod: PullRequestMergeMethod!,
  ) {
    enablePullRequestAutoMerge(input: {
      pullRequestId: $pullRequestId,
      mergeMethod: $mergeMethod,
    }) {
      pullRequest {
        autoMergeRequest {
          enabledAt
        }
      }
    }
  }`;
