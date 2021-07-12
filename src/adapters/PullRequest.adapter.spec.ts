import { PullRequest, PullRequestDto } from '../@types';
import { MergeableState, PullRequestState } from '../constants';
import { PullRequestAdapter } from './PullRequest.adapter';

describe('PullRequestAdapter', () => {
  describe('fromDto', () => {
    it('should adapt from DTO', () => {
      const pullRequestDto: PullRequestDto = {
        id: 'pr-id',
        author: { login: 'author' },
        title: 'PR title',
        labels: { nodes: [{ name: 'foo' }, { name: 'bar' }] },
        isDraft: false,
        checksUrl: 'https://url.com/path',
        state: PullRequestState.open,
        mergeable: MergeableState.mergeable,
      };

      const pullRequest: PullRequest = {
        id: 'pr-id',
        author: { login: 'author' },
        title: 'PR title',
        labels: [{ name: 'foo' }, { name: 'bar' }],
        isDraft: false,
        checksUrl: 'https://url.com/path',
        state: PullRequestState.open,
        mergeable: MergeableState.mergeable,
      };

      expect(PullRequestAdapter.fromDto(pullRequestDto)).toEqual(pullRequest);
    });
  });
});
