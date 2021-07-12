import { PullRequestDto } from '../dto';

export interface MergePullRequestMutationData {
  mergePullRequest: {
    pullRequest: Pick<PullRequestDto, 'state'>;
  };
}
