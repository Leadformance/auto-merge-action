import { mockPullRequest } from '../../test/mockData';
import { CheckCode, MergeMethod, PullRequestState } from '../constants';
import { CheckService } from './Check.service';

jest.mock('./Organizations.service.ts');
jest.mock('./PullRequests.service.ts');
jest.mock('./Repositories.service.ts');

describe('CheckService', () => {
  const service = new CheckService('token');

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('getPullRequest', () => {
    it('should return the pull request', async () => {
      await expect(
        service.getPullRequest('octokit', 'graphql', 4)
      ).resolves.toEqual(mockPullRequest('4'));
    });
  });

  describe('isContextEventValid', () => {
    it.each([
      [CheckCode.invalid, 'push'],
      [CheckCode.valid, 'pull_request'],
      [CheckCode.valid, 'pull_request_target'],
    ])('should return "%s" with event "%s"', (expected, value) => {
      expect(service.isContextEventValid(value)).toEqual(expected);
    });
  });

  describe('isTitleRequirementValid', () => {
    it.each([
      [CheckCode.ignored, ''],
      [CheckCode.invalid, 'foo'],
      [CheckCode.valid, 'automerge'],
      [CheckCode.valid, '\\[automerge]$'],
      [CheckCode.valid, '/\\[automerge]$/'],
      [CheckCode.valid, '/\\[AUTOMERGE]$/i'],
    ])('should return "%s" with condition "%s"', (expected, value) => {
      expect(
        service.isTitleRequirementValid('Pull request [automerge]', value)
      ).toEqual(expected);
    });
  });

  describe('isLabelsRequirementValid', () => {
    it.each([
      [CheckCode.ignored, []],
      [CheckCode.invalid, ['foo']],
      [CheckCode.valid, ['automerge']],
    ])('should return "%s" with condition "%s"', (expected, value) => {
      expect(
        service.isLabelsRequirementValid([{ name: 'automerge' }], value)
      ).toEqual(expected);
    });
  });

  describe('isUsersRequirementValid', () => {
    it.each([
      [CheckCode.ignored, []],
      [CheckCode.invalid, ['foo']],
      [CheckCode.valid, ['author']],
    ])('should return "%s" with condition "%s"', (expected, value) => {
      expect(service.isUsersRequirementValid('author', value)).toEqual(
        expected
      );
    });
  });

  describe('isTeamsRequirementValid', () => {
    it.each([
      [CheckCode.ignored, []],
      [CheckCode.invalid, ['@foo/bar']],
      [CheckCode.valid, ['@org/team']],
    ])('should return "%s" with condition "%s"', async (expected, value) => {
      await expect(
        service.isTeamsRequirementValid('author', value)
      ).resolves.toEqual(expected);
    });
  });

  describe('approvePullRequest', () => {
    it.each([[true, false]])(
      'should throw an Error (isDraft: %s, enableReadyForReview: %s)',
      async (isDraft, enableReadyForReview) => {
        await expect(
          service.approvePullRequest(
            '4',
            'https://domain.com/pull/4/checks',
            isDraft,
            'job-name',
            4,
            44,
            enableReadyForReview
          )
        ).rejects.toThrowError();
      }
    );

    it.each([
      [true, true],
      [false, false],
      [false, true],
    ])(
      'should return the review (isDraft: %s, enableReadyForReview: %s)',
      async (isDraft, enableReadyForReview) => {
        await expect(
          service.approvePullRequest(
            '4',
            'https://domain.com/pull/4/checks',
            isDraft,
            'job-name',
            4,
            44,
            enableReadyForReview
          )
        ).resolves.toEqual({
          url: 'https://domain.com/pull/4/review',
        });
      }
    );
  });

  describe('enableAutoMergeOnPullRequest', () => {
    it('should return the auto merge request', async () => {
      await expect(
        service.enableAutoMergeOnPullRequest('4', MergeMethod.rebase)
      ).resolves.toEqual({
        enabledAt: expect.any(Date),
      });
    });
  });

  describe('mergePullRequest', () => {
    it('should return the new state of the pull request', async () => {
      await expect(
        service.mergePullRequest('4', MergeMethod.rebase)
      ).resolves.toEqual({
        state: PullRequestState.merged,
      });
    });
  });
});
