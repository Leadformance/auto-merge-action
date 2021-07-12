import { MergeableState, PullRequestState } from '../../constants';
import { Actor } from './Actor';
import { Label } from './Label';

export interface PullRequest {
  id: string;
  author: Actor;
  title: string;
  labels: Label[];
  isDraft: boolean;
  checksUrl: string;
  state: PullRequestState;
  mergeable: MergeableState;
}
