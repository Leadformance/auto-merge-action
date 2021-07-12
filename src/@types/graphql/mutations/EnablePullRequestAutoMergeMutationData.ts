import { AutoMergeRequestDto } from '../dto';

export interface EnablePullRequestAutoMergeMutationData {
  enablePullRequestAutoMerge: {
    pullRequest: {
      autoMergeRequest: AutoMergeRequestDto;
    };
  };
}
