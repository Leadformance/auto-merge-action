import { ExitCode, info, setFailed, setOutput } from '@actions/core';
import { context } from '@actions/github';

import { Check } from './Check';
import { Output } from './constants';
import { InputsService } from './services';

new Check(InputsService.getInputs(), context)
  .run()
  .then(() => {
    info('🎉  The pull request will be merged automatically!');
    setOutput(Output.merged, true);
    setOutput(Output.reason, null);
    return ExitCode.Success;
  })
  .catch(({ message }) => {
    setOutput(Output.merged, false);
    setOutput(Output.reason, message);
    setFailed(`❌  ${message}`);
  });
