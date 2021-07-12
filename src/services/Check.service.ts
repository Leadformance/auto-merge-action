import {
  AutoMergeRequest,
  Label,
  PullRequest,
  PullRequestReview,
} from '../@types';
import {
  CheckCode,
  MergeMethod,
  PullRequestReviewEvent,
  SUPPORTED_EVENTS,
} from '../constants';
import { OrganizationsService } from './Organizations.service';
import { PullRequestsService } from './PullRequests.service';
import { RepositoriesService } from './Repositories.service';

export class CheckService {
  private readonly organizationsService: OrganizationsService;
  private readonly repositoriesService: RepositoriesService;
  private readonly pullRequestsService: PullRequestsService;

  constructor(token: string) {
    this.organizationsService = new OrganizationsService(token);
    this.repositoriesService = new RepositoriesService(token);
    this.pullRequestsService = new PullRequestsService(token);
  }

  public async getPullRequest(
    owner: string,
    repo: string,
    pullRequestNumber: number
  ): Promise<PullRequest> {
    return this.repositoriesService.getPullRequest(
      owner,
      repo,
      pullRequestNumber
    );
  }

  public isContextEventValid(eventName: string): CheckCode {
    return this.getCheckCode(SUPPORTED_EVENTS.includes(eventName));
  }

  public isTitleRequirementValid(
    pullRequestTitle: string,
    titleSearch?: string
  ): CheckCode {
    if (!titleSearch) return CheckCode.ignored;

    const inputRegex = new RegExp(/^\/(?<exp>.+)\/(?<flags>[dgimsuy]+)?$/);
    const inputMatch = inputRegex.exec(titleSearch);

    const titleRegex = inputMatch?.groups
      ? new RegExp(inputMatch.groups.exp, inputMatch.groups.flags)
      : new RegExp(titleSearch);

    const condition = !!new RegExp(titleRegex).exec(pullRequestTitle);

    return this.getCheckCode(condition);
  }

  public isLabelsRequirementValid(
    pullRequestLabels: Label[],
    labels: string[]
  ): CheckCode {
    if (!labels.length) return CheckCode.ignored;

    const pullLabels = pullRequestLabels.map(label => label.name);
    const condition = labels.every(label => pullLabels.includes(label));

    return this.getCheckCode(condition);
  }

  public isUsersRequirementValid(author: string, users: string[]): CheckCode {
    if (!users.length) return CheckCode.ignored;

    return this.getCheckCode(users.includes(author));
  }

  public async isTeamsRequirementValid(
    author: string,
    teams: string[]
  ): Promise<CheckCode> {
    if (!teams.length) return CheckCode.ignored;

    const members: string[][] = await Promise.all(
      teams.map(teamName => this.organizationsService.getTeamMembers(teamName))
    );

    return this.getCheckCode(
      !members.length || members.flat().includes(author)
    );
  }

  public async approvePullRequest(
    pullRequestId: string,
    pullRequestChecksUrl: string,
    isPullRequestDraft: boolean,
    job: string,
    runNumber: number,
    runId: number,
    canMarkPullRequestReadyForReview: boolean
  ): Promise<PullRequestReview> {
    if (isPullRequestDraft) {
      if (!canMarkPullRequestReadyForReview)
        throw new Error(
          'The pull request is a draft, auto-merge cannot be enabled'
        );

      await this.pullRequestsService.markPullRequestReadyForReview(
        pullRequestId
      );
    }

    return this.pullRequestsService.addPullRequestReview(
      pullRequestId,
      PullRequestReviewEvent.approve,
      `Approved by **${job}** - run [#${runNumber}](${pullRequestChecksUrl}?check_run_id=${runId})`
    );
  }

  public async enableAutoMergeOnPullRequest(
    pullRequestId: string,
    mergeMethod: MergeMethod
  ): Promise<AutoMergeRequest> {
    return this.pullRequestsService.enablePullRequestAutoMerge(
      pullRequestId,
      mergeMethod
    );
  }

  public async mergePullRequest(
    pullRequestId: string,
    mergeMethod: MergeMethod
  ): Promise<Pick<PullRequest, 'state'>> {
    return this.pullRequestsService.mergePullRequest(
      pullRequestId,
      mergeMethod
    );
  }

  private getCheckCode(isValid: boolean): CheckCode.valid | CheckCode.invalid {
    return isValid ? CheckCode.valid : CheckCode.invalid;
  }
}
