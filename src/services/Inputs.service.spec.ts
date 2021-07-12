import { MergeMethod, Input } from '../constants';
import { InputsService } from './Inputs.service';
import { InputsHelper } from '../../test/InputsHelper';

describe('InputsService', () => {
  describe('getInputs', () => {
    afterEach(() => {
      InputsHelper.clearInputs([
        Input.token,
        Input.mergeMethod,
        Input.enableApproval,
        Input.enableReadyForReview,
        Input.title,
        Input.labels,
        Input.users,
        Input.teams,
      ]);
    });

    it('should throw an Error if the token is undefined', () => {
      expect(InputsService.getInputs).toThrowError();
    });

    it.each([
      {
        [Input.token]: 'token',
      },
      {
        [Input.token]: 'token',
        [Input.mergeMethod]: MergeMethod.merge,
      },
      {
        [Input.token]: 'token',
        [Input.mergeMethod]: MergeMethod.squash,
      },
    ])('should return all inputs', (inputs: Record<string, any>) => {
      InputsHelper.setInputs(inputs);

      expect(InputsService.getInputs()).toEqual({
        token: inputs[Input.token],
        mergeMethod: inputs[Input.mergeMethod] || MergeMethod.rebase,
        enableApproval: false,
        enableReadyForReview: false,
        title: '',
        labels: [],
        users: [],
        teams: [],
      });
    });
  });
});
