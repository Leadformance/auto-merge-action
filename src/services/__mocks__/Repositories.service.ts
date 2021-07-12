import { PullRequest } from '../../@types';
import { mockPullRequest } from '../../../test/mockData';

export class RepositoriesService {
  public async getPullRequest(
    _owner: string,
    _repo: string,
    pullRequestNumber: number
  ): Promise<PullRequest> {
    return new Promise(resolve => {
      resolve(mockPullRequest(`${pullRequestNumber}`));
    });
  }
}
