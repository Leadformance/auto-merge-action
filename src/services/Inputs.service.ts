import {
  getBooleanInput,
  getInput,
  getMultilineInput,
  InputOptions,
} from '@actions/core';

import { Inputs } from '../@types';
import { Input, MergeMethod } from '../constants';

export class InputsService {
  public static getInputs(): Inputs {
    return {
      token: InputsService.token,
      mergeMethod: InputsService.mergeMethod,
      enableApproval: InputsService.enableApproval,
      enableReadyForReview: InputsService.enableReadyForReview,
      title: InputsService.title,
      labels: InputsService.labels,
      users: InputsService.users,
      teams: InputsService.teams,
    };
  }

  private static get token(): Inputs['token'] {
    return this.getInput(Input.token, { required: true });
  }

  private static get mergeMethod(): Inputs['mergeMethod'] {
    switch (this.getInput(Input.mergeMethod)) {
      case MergeMethod.merge:
        return MergeMethod.merge;
      case MergeMethod.squash:
        return MergeMethod.squash;
      default:
        return MergeMethod.rebase;
    }
  }

  private static get enableApproval(): Inputs['enableApproval'] {
    return this.getBooleanInput(Input.enableApproval);
  }

  private static get enableReadyForReview(): Inputs['enableReadyForReview'] {
    return this.getBooleanInput(Input.enableReadyForReview);
  }

  private static get title(): Inputs['title'] {
    return this.getInput(Input.title);
  }

  private static get labels(): Inputs['labels'] {
    return this.getMultilineInput(Input.labels);
  }

  private static get users(): Inputs['users'] {
    return this.getMultilineInput(Input.users);
  }

  private static get teams(): Inputs['teams'] {
    return this.getMultilineInput(Input.teams);
  }

  private static getInput(name: string, options?: InputOptions): string {
    return getInput(name, { trimWhitespace: true, ...options });
  }

  private static getMultilineInput(
    name: string,
    options?: InputOptions
  ): string[] {
    return getMultilineInput(name, { trimWhitespace: true, ...options });
  }

  private static getBooleanInput(
    name: string,
    options?: InputOptions
  ): boolean {
    try {
      return getBooleanInput(name, { trimWhitespace: true, ...options });
    } catch {
      return false;
    }
  }
}
