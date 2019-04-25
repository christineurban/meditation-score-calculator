const OFF = 0, WARN = 1, ERROR = 2;

module.exports = {
  extends: [
    'eslint:recommended'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017
  },
  plugins: [ 'babel' ],
  env: {
    es6: true,
    node: true
  },
  rules: {
    // Possible Errors
    'no-await-in-loop': ERROR,
    'no-console': OFF,
    'no-extra-parens': [ERROR, 'all', { nestedBinaryExpressions: false, ignoreJSX: 'multi-line' }],
    'no-prototype-builtins': WARN,
    'no-template-curly-in-string': WARN,

    // Best Practices
    'array-callback-return': WARN,
    'block-scoped-var': ERROR,
    'complexity': WARN,
    'curly': [ERROR, 'all'],
    'dot-location': [WARN, 'property'],
    'dot-notation': WARN,
    'eqeqeq': [ERROR, 'smart'],
    'guard-for-in': WARN,
    'no-alert': WARN,
    'no-caller': ERROR,
    'no-div-regex': ERROR,
    'no-empty-function': ERROR,
    'no-eq-null': ERROR,
    'no-eval': ERROR,
    'no-extend-native': WARN,
    'no-extra-bind': ERROR,
    'no-extra-label': WARN,
    'no-floating-decimal': ERROR,
    'no-implicit-globals': ERROR,
    'no-implied-eval': ERROR,
    'no-invalid-this': OFF,
    'no-labels': ERROR,
    'no-lone-blocks': ERROR,
    'no-loop-func': ERROR,
    'no-multi-spaces': [ERROR, {
                                  ignoreEOLComments: true,
                                  exceptions: {
                                    Property: true,
                                    VariableDeclarator: true,
                                    ImportDeclaration: true
                                  }
    }],
    'no-new': ERROR,
    'no-new-func': ERROR,
    'no-new-wrappers': ERROR,
    'no-octal-escape': ERROR,
    'no-proto': ERROR,
    'no-return-assign': ERROR,
    'no-return-await': ERROR,
    'no-script-url': ERROR,
    'no-self-compare': ERROR,
    'no-sequences': ERROR,
    'no-throw-literal': ERROR,
    'no-unmodified-loop-condition': ERROR,
    'no-unused-expressions': ERROR,
    'no-useless-call': ERROR,
    'no-useless-concat': WARN,
    'no-useless-return': WARN,
    'no-void': ERROR,
    'no-with': ERROR,
    'radix': [WARN, 'as-needed'],
    'require-await': ERROR,
    'wrap-iife': [ERROR, 'inside'],
    'yoda': WARN,

    // Strict Mode
    'strict': [ERROR, 'global'],

    // Variables
    'no-label-var': ERROR,
    'no-shadow': [WARN, { allow: ['resolve', 'reject', 'done', 'cb', 'callback', 'err', 'res', 'i'] }],
    'no-shadow-restricted-names': ERROR,
    'no-undef-init': WARN,
    'no-unused-vars': [ERROR, { args: 'none' }],
    'no-use-before-define': [ERROR, { functions: false }],

    // Node.js and CommonJS
    'callback-return': [WARN, ['callback', 'cb', 'next', 'primaryCallback']],
    'global-require': ERROR,
    'handle-callback-err': [ERROR, '^(e|err|error)$'],
    'no-buffer-constructor': ERROR,
    'no-mixed-requires': WARN,
    'no-new-require': ERROR,
    'no-path-concat': ERROR,
    'no-process-env': ERROR,
    'no-sync': ERROR,

    // Stylistic Issues
    'array-bracket-newline': [ERROR, 'consistent'],
    'array-bracket-spacing': [ERROR, 'never'],
    'block-spacing': ERROR,
    'brace-style': [ERROR, '1tbs', { allowSingleLine: true }],
    'comma-dangle': [ERROR, 'never'],
    'comma-spacing': [ERROR, { before: false, after: true }],
    'comma-style': [ERROR, 'last'],
    'computed-property-spacing': [ERROR, 'never'],
    'consistent-this': [ERROR, 'vm', 'self', '_this'],
    'eol-last': ERROR,
    'func-call-spacing': ERROR,
    'func-name-matching': ERROR,
    'function-paren-newline': [ERROR, 'consistent'],
    'implicit-arrow-linebreak': [ERROR, 'beside'],
    'indent': [ERROR, 2, { SwitchCase: 1,
                           MemberExpression: 1,
                           VariableDeclarator: { var: 2, let: 2, const: 3 },
                           ArrayExpression: 'first',
                           ObjectExpression: 'first',
                           ImportDeclaration: 'first',
                           CallExpression: { arguments : 'first'},
                           FunctionExpression : { parameters: 'first'},
                           FunctionDeclaration: { parameters: 'first'},
                           ignoredNodes: [ 'JSXAttribute', 'SXSpreadAttribute' ]
    }],
    'key-spacing': [ERROR, { beforeColon: false, afterColon: true, mode: 'minimum' }],
    'keyword-spacing': [ERROR, { before: true, after: true }],
    'max-depth': [ERROR, 4],
    'max-len': ['error', { 'code': 120 }],
    'max-lines': [WARN, 1000],
    'max-nested-callbacks': ERROR,
    'max-statements-per-line': [ERROR, { max: 2 }],
    'multiline-ternary': [ERROR, 'always-multiline'],
    'new-cap': [ERROR, { newIsCapExceptions: ['acl.memoryBackend', 'acl'] }],
    'new-parens': ERROR,
    'newline-after-var': ['error', 'always'],
    'newline-per-chained-call': [ERROR, { ignoreChainWithDepth: 2 }],
    'no-array-constructor': ERROR,
    'no-bitwise': ERROR,
    'no-continue': ERROR,
    'no-lonely-if': ERROR,
    'no-multi-assign': ERROR,
    'no-multiple-empty-lines': [ERROR, { max: 2, maxEOF: 1, maxBOF: 1 }],
    'no-new-object': ERROR,
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-tabs': ERROR,
    'no-trailing-spaces': ERROR,
    'no-unneeded-ternary': ERROR,
    'no-whitespace-before-property': ERROR,
    'object-curly-newline': [ERROR, { consistent: true }],
    'object-curly-spacing': [ERROR, 'always'],
    'one-var-declaration-per-line': [ERROR, 'always'],
    'operator-assignment': WARN,
    'padded-blocks': [ERROR, 'never'],
    'quote-props': [ERROR, 'as-needed'],
    'quotes': [ERROR, 'single'],
    'semi': ERROR,
    'semi-spacing': ERROR,
    'semi-style': ERROR,
    'space-before-blocks': ERROR,
    'space-before-function-paren': [ERROR, {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'space-in-parens': ERROR,
    'space-infix-ops': ERROR,
    'space-unary-ops': ERROR,
    'spaced-comment': ERROR,
    'switch-colon-spacing': ERROR,
    'template-tag-spacing': ERROR,
    'unicode-bom': ERROR,
    'wrap-regex': ERROR,

    // ECMAScript 6
    // 'arrow-body-style': [ERROR, 'as-needed'],
    'arrow-parens': [ERROR, 'always'],
    'arrow-spacing': ERROR,
    'babel/no-invalid-this': OFF,
    'generator-star-spacing': [ERROR, 'after'],
    'no-duplicate-imports': ERROR,
    'no-useless-computed-key': ERROR,
    'no-useless-constructor': ERROR,
    'no-useless-rename': ERROR,
    'no-var': ERROR,
    'object-shorthand': [ERROR, 'properties'],
    'prefer-arrow-callback': [ERROR, { 'allowNamedFunctions': false } ],
    'prefer-const': OFF,
    'prefer-rest-params': ERROR,
    'prefer-spread': ERROR,
    'prefer-template': ERROR,
    'rest-spread-spacing': ERROR,
    'symbol-description': ERROR,
    'template-curly-spacing': ERROR,
    'yield-star-spacing': [ERROR, 'after']
  }
};
