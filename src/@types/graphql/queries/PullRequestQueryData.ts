import { PullRequestDto } from '../dto';

export interface PullRequestQueryData {
  repository: {
    pullRequest: PullRequestDto;
  };
}
