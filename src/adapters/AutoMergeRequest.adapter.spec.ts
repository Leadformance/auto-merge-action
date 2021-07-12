import { AutoMergeRequest, AutoMergeRequestDto } from '../@types';
import { AutoMergeRequestAdapter } from './AutoMergeRequest.adapter';

describe('AutoMergeRequestAdapter', () => {
  describe('fromDto', () => {
    it('should adapt from DTO', () => {
      const date = new Date();

      const autoMergeRequestDto: AutoMergeRequestDto = {
        enabledAt: date.toISOString(),
      };
      const autoMergeRequest: AutoMergeRequest = { enabledAt: date };

      expect(AutoMergeRequestAdapter.fromDto(autoMergeRequestDto)).toEqual(
        autoMergeRequest
      );
    });
  });
});
