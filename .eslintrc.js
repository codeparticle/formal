module.exports = {
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'project': ['./tsconfig.json', './tsconfig.dev.json'],
        'extraFileExtensions': ['.md']
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'env': {
        'browser': true,
        'node': true,
        'es6': true,
        'jest': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    'rules': {
        "comma-spacing": "off",
        'no-prototype-builtins': 0,
        "@typescript-eslint/comma-spacing": ["error"],
        '@typescript-eslint/quotes': ['error', 'backtick'],
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/prefer-regexp-exec': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/triple-slash-reference': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/semi': ["error", "never"],
        '@typescript-eslint/member-delimiter-style': [
            2,
            {
                multiline: {
                    delimiter: 'none'
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false
                }
            }
        ],
        'object-curly-spacing': ['error', 'always'],
        'indent': ['error', 2],
        'comma-dangle': ['error', 'always-multiline'],
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always', prev: '*', next: 'return'
            },
            {
                blankLine: 'never', prev: 'return', next: '*'
            },
            {
                blankLine: 'always', prev: [
                    'const',
                    'let',
                    'var'
                ], next: '*'
            },
            {
                blankLine: 'any', prev: [
                    'const',
                    'let',
                    'var'
                ], next: [
                    'const',
                    'let',
                    'var'
                ]
            },
            {
                blankLine: 'always', prev: [
                    'block-like'
                ], next: '*'
            },
            {
                blankLine: 'always', prev: [
                    '*'
                ], next: 'block-like'
            },
            {
                blankLine: 'always', prev: [
                    'import'
                ], next: '*'
            },
            {
                blankLine: 'any', prev: [
                    'import'
                ], next: 'import'
            },
        ],
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1, maxEOF: 1, maxBOF: 0
            }
        ],
    }
}