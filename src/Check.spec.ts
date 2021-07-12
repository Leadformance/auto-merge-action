import * as core from '@actions/core';

import { InputsHelper } from '../test/InputsHelper';
import { IMockContext, MockContext } from '../test/MockContext';
import { MockLogger } from '../test/MockLogger';
import { Check } from './Check';
import { Input } from './constants';
import { InputsService } from './services';

jest.mock('./services/Organizations.service.ts');
jest.mock('./services/PullRequests.service.ts');
jest.mock('./services/Repositories.service.ts');

interface EnvInputs {
  [Input.token]?: string;
  [Input.mergeMethod]?: string;
  [Input.enableApproval]?: string;
  [Input.enableReadyForReview]?: string;
  [Input.title]?: string;
  [Input.labels]?: string;
  [Input.users]?: string;
  [Input.teams]?: string;
}

describe('Check', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    const mockLogger = new MockLogger();

    beforeAll(() => {
      const logHandler = (error: string | Error) => {
        mockLogger.log(
          `${typeof error === 'string' ? error : `Error: ${error.message}`}`
        );
      };

      jest.spyOn(core, 'debug').mockImplementation(logHandler);
      jest.spyOn(core, 'info').mockImplementation(logHandler);
      jest.spyOn(core, 'warning').mockImplementation(logHandler);
      jest.spyOn(core, 'error').mockImplementation(logHandler);
    });

    afterEach(() => {
      mockLogger.clear();

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

    describe('should throw an Error', () => {
      it.each([
        ['with wrong "event"', {}, { eventName: 'lorem' }],
        ['with wrong "title"', { title: 'lorem' }, {}],
        ['with wrong "labels"', { labels: 'lorem' }, {}],
        ['with wrong "users"', { users: 'lorem' }, {}],
        ['with wrong "teams"', { teams: '@foo/bar' }, {}],
        [
          'with pull request conflicts',
          {},
          { payload: { pull_request: { number: 5 } } },
        ],
        [
          'with pull request not mergeable',
          {},
          { payload: { pull_request: { number: 6 } } },
        ],
        [
          'with pull request closed',
          {},
          { payload: { pull_request: { number: 7 } } },
        ],
      ])('%s', async (_, inputs: EnvInputs, context: Partial<IMockContext>) => {
        InputsHelper.setInputs({ [Input.token]: 'token', ...inputs });

        expect.assertions(2);

        try {
          await new Check(
            InputsService.getInputs(),
            new MockContext(context)
          ).run();
        } catch (error) {
          // eslint-disable-next-line jest/no-conditional-expect,jest/no-try-expect
          expect(error).toEqual(new Error(error.message));
          core.error(`❌  ${error.message}`);
        } finally {
          expect(mockLogger.logs).toMatchSnapshot();
        }
      });
    });

    describe('should run without error', () => {
      it.each([
        ['without inputs', {}],
        [
          'with inputs',
          {
            title: '/pull/i',
            labels: 'foo',
            users: 'author',
            teams: '@org/team',
          },
        ],
      ])('%s', async (_, inputs: EnvInputs) => {
        InputsHelper.setInputs({ [Input.token]: 'token', ...inputs });

        expect.assertions(1);

        try {
          await new Check(InputsService.getInputs(), new MockContext()).run();
          core.info('🎉  The pull request will be merged automatically!');
        } catch {
          // eslint-disable-next-line jest/no-conditional-expect,jest/no-try-expect
          expect(true).toEqual(false);
        } finally {
          expect(mockLogger.logs).toMatchSnapshot();
        }
      });
    });
  });
});
