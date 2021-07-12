import { MergeableState, PullRequestState } from '../../../constants';
import { Actor, Label } from '../../entities';
import { Nodes } from '../utils';

export interface PullRequestDto {
  id: string;
  author: Actor;
  title: string;
  labels: Nodes<Label>;
  isDraft: boolean;
  checksUrl: string;
  state: PullRequestState;
  mergeable: MergeableState;
}
