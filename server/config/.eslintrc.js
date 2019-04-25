const OFF = 0, WARN = 1, ERROR = 2;

module.exports = {
  rules: {
    'global-require': OFF,
    'no-console': OFF,
    'no-magic-numbers': OFF,
    'no-process-env': OFF,
    'no-sync': OFF
  },
  env: {
    node: true
  },
};
