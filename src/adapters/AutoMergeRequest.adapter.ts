import { AutoMergeRequest, AutoMergeRequestDto } from '../@types';

export class AutoMergeRequestAdapter {
  public static fromDto(
    autoMergeRequestDto: AutoMergeRequestDto
  ): AutoMergeRequest {
    return {
      enabledAt: new Date(autoMergeRequestDto.enabledAt),
    };
  }
}
