const OFF = 0, WARN = 1, ERROR = 2;

module.exports = {
  extends: [
    'plugin:react/recommended'
  ],
  env: {
    browser: true
  },
  plugins: [
    'react'
  ],
  parserOptions: {
    'ecmaFeatures': {
      'jsx': true
    }
  },
  settings: {
    'react': {
      'createClass': 'createReactClass', // Regex for Component Factory to use,
                                         // default to 'createReactClass'
      'pragma': 'React',  // Pragma to use, default to 'React'
      'version': 'detect', // React version. 'detect' automatically picks the version you have installed.
                           // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      'flowVersion': '0.53' // Flow version
    },
    'propWrapperFunctions': [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        'forbidExtraProps',
        {'property': 'freeze', 'object': 'Object'},
        {'property': 'myFavoriteWrapper'}
    ]
  },
  rules: {
    'react/jsx-indent-props': [ERROR, 'first']
  }
};
