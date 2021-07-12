export const PULL_REQUEST_QUERY_NAME = 'PullRequest';

export const PULL_REQUEST_QUERY = `
  query ${PULL_REQUEST_QUERY_NAME}(
    $owner: String!,
    $repo: String!,
    $pullRequestNumber: Int!
  ) {
    repository(
      owner: $owner,
      name: $repo
    ) {
      pullRequest(number: $pullRequestNumber) {
        id
        author {
          login
        }
        title
        labels(first: 10) {
          nodes {
            name
          }
        }
        isDraft,
        checksUrl,
        state
        mergeable
      }
    }
  }`;
