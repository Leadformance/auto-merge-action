// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('@bridge/semantic-release-config');

config.plugins.push([
  '@semantic-release/exec',
  {
    publishCmd:
      'scripts/publish-major-tag.sh ${nextRelease.version} ${nextRelease.gitHead} ${nextRelease.channel}', // eslint-disable-line no-template-curly-in-string
  },
]);

module.exports = config;
