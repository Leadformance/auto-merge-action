import { ExitCode, info } from '@actions/core';
import { Context } from '@actions/github/lib/context';

import { Inputs } from './@types';
import {
  CheckCode,
  Input,
  MergeableState,
  PullRequestState,
} from './constants';
import { CheckService } from './services';

export class Check {
  private readonly service: CheckService;

  constructor(
    private readonly inputs: Inputs,
    private readonly context: Context
  ) {
    this.service = new CheckService(this.inputs.token);
  }

  public async run(): Promise<ExitCode> {
    const {
      eventName,
      repo: { owner, repo },
      job,
      runNumber,
      runId,
      issue,
    } = this.context;

    // Validate context event
    info('Validate context event...');
    if (this.service.isContextEventValid(eventName) === CheckCode.invalid)
      throw new Error(`This action does not supports "${eventName}" events`);

    // Get pull request
    info('Get pull request info...');
    const pullRequest = await this.service.getPullRequest(
      owner,
      repo,
      issue.number
    );

    if (pullRequest.state !== PullRequestState.open)
      throw new Error('The pull request is not opened');

    const author = pullRequest.author.login;

    // Validate title
    await this.validateRequirement(
      Input.title,
      () =>
        this.service.isTitleRequirementValid(
          pullRequest.title,
          this.inputs.title
        ),
      `The title of the pull request does not match the search: ${this.inputs.title}`
    );

    // Validate labels
    await this.validateRequirement(
      Input.labels,
      () =>
        this.service.isLabelsRequirementValid(
          pullRequest.labels,
          this.inputs.labels
        ),
      `The pull request does not have the required labels: ${this.inputs.labels.join(
        ', '
      )}`
    );

    // Validate users
    await this.validateRequirement(
      Input.users,
      () => this.service.isUsersRequirementValid(author, this.inputs.users),
      `User "${author}" is not authorized`
    );

    // Validate teams
    await this.validateRequirement(
      Input.teams,
      async () =>
        this.service.isTeamsRequirementValid(author, this.inputs.teams),
      `User "${author}" is not part of any teams`
    );

    // Approve pull request
    info('Approve pull request...');
    await this.service.approvePullRequest(
      pullRequest.id,
      pullRequest.checksUrl,
      pullRequest.isDraft,
      job,
      runNumber,
      runId,
      this.inputs.enableReadyForReview
    );

    // Merge pull request
    if (pullRequest.mergeable === MergeableState.conflicting)
      throw new Error(
        'The pull request cannot be merged due to merge conflicts'
      );

    if (pullRequest.mergeable === MergeableState.unknown)
      throw new Error('The pull request cannot be merged');

    try {
      info('Enable auto-merge on pull request...');
      await this.service.enableAutoMergeOnPullRequest(
        pullRequest.id,
        this.inputs.mergeMethod
      );
    } catch (error) {
      info(`Auto-merge request failed: ${error.message}`);
      info('Merging the pull request...');
      await this.service.mergePullRequest(
        pullRequest.id,
        this.inputs.mergeMethod
      );
    }

    return ExitCode.Success;
  }

  private async validateRequirement(
    name: string,
    validate: () => CheckCode | Promise<CheckCode>,
    error: string
  ): Promise<void> {
    info(`Validate ${name}...`);

    const code = await validate();

    switch (code) {
      case CheckCode.invalid:
        info(`  ✘︎ Requirement ${name} is not valid`);
        throw new Error(error);
      case CheckCode.valid:
        info(`  ✔︎ Requirement ${name} is valid`);
        break;
      case CheckCode.ignored:
        info(`  ○ Requirement ${name} was ignored`);
        break;
    }
  }
}
