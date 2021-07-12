import { MergeMethod } from '../../constants';

export interface Inputs {
  token: string;
  mergeMethod: MergeMethod;
  enableApproval: boolean;
  enableReadyForReview: boolean;
  title: string;
  labels: string[];
  users: string[];
  teams: string[];
}
