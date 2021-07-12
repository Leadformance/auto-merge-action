import { PullRequest, PullRequestQueryData } from '../@types';
import { PullRequestAdapter } from '../adapters';
import { PULL_REQUEST_QUERY } from '../graphql';
import { AbstractGraphQLService } from './AbstractGraphQL.service';

export class RepositoriesService extends AbstractGraphQLService {
  public async getPullRequest(
    owner: string,
    repo: string,
    pullRequestNumber: number
  ): Promise<PullRequest> {
    const data = await this.graphql<PullRequestQueryData>(PULL_REQUEST_QUERY, {
      owner,
      repo,
      pullRequestNumber,
    });

    return PullRequestAdapter.fromDto(data.repository.pullRequest);
  }
}
