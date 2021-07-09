import { info, setFailed } from '@actions/core';

try {
  info('Auto-merge action');
} catch (error) {
  setFailed(error.message);
}
