import { WebhookPayload } from '@actions/github/lib/interfaces';

export interface IMockContext {
  payload: WebhookPayload;
  eventName: string;
  sha: string;
  ref: string;
  workflow: string;
  action: string;
  actor: string;
  job: string;
  runNumber: number;
  runId: number;
  apiUrl: string;
  serverUrl: string;
  graphqlUrl: string;
}

export class MockContext implements IMockContext {
  public payload: WebhookPayload;
  public eventName: string;
  public sha: string;
  public ref: string;
  public workflow: string;
  public action: string;
  public actor: string;
  public job: string;
  public runNumber: number;
  public runId: number;
  public apiUrl: string;
  public serverUrl: string;
  public graphqlUrl: string;

  constructor(context?: Partial<IMockContext>) {
    this.payload = context?.payload || { pull_request: { number: 4 } };
    this.eventName = context?.eventName || 'pull_request';
    this.sha = context?.sha || 'sha';
    this.ref = context?.ref || 'ref';
    this.workflow = context?.workflow || 'workflow';
    this.action = context?.action || 'action';
    this.actor = context?.actor || 'bot';
    this.job = context?.job || 'job';
    this.runNumber = context?.runNumber || 2;
    this.runId = context?.runId || 22;
    this.apiUrl = context?.apiUrl || 'https://api.github.com';
    this.serverUrl = context?.serverUrl || 'https://github.com';
    this.graphqlUrl = context?.graphqlUrl || 'https://api.github.com/graphql';
  }

  public get issue(): {
    owner: string;
    repo: string;
    number: number;
  } {
    const payload = this.payload;
    return Object.assign(Object.assign({}, this.repo), {
      number: (payload.issue || payload.pull_request || payload).number,
    });
  }

  public get repo(): {
    owner: string;
    repo: string;
  } {
    const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'owner/repo').split(
      '/'
    );
    return { owner, repo };
  }
}
