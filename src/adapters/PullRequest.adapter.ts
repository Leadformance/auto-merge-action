import { PullRequest, PullRequestDto } from '../@types';

export class PullRequestAdapter {
  public static fromDto(pullRequestDto: PullRequestDto): PullRequest {
    return {
      id: pullRequestDto.id,
      author: pullRequestDto.author,
      title: pullRequestDto.title,
      labels: pullRequestDto.labels.nodes,
      isDraft: pullRequestDto.isDraft,
      checksUrl: pullRequestDto.checksUrl,
      state: pullRequestDto.state,
      mergeable: pullRequestDto.mergeable,
    };
  }
}
