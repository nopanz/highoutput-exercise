module.exports = {
    "env": {
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/indent": [
            "error",
            4,
            {
                "CallExpression": {
                    "arguments": "first"
                },
                "FunctionDeclaration": {
                    "parameters": "first"
                },
                "FunctionExpression": {
                    "parameters": "first"
                }
            }
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/no-param-reassign": "error",
        "@typescript-eslint/no-this-alias": "error",
        "@typescript-eslint/quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "arrow-parens": [
            "off",
            "as-needed"
        ],
        "camelcase": "error",
        "capitalized-comments": "error",
        "curly": [
            "error",
            "multi-line"
        ],
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "id-blacklist": "error",
        "id-match": "error",
        "max-len": [
            "error",
            {
                "code": 100
            }
        ],
        "no-duplicate-imports": "error",
        "no-eval": "error",
        "no-multiple-empty-lines": "error",
        "no-new-wrappers": "error",
        "no-trailing-spaces": "error",
        "no-underscore-dangle": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "one-var": [
            "error",
            "never"
        ],
        "prefer-const": "error",
        "prefer-template": "error",
        "quote-props": [
            "error",
            "as-needed"
        ],
        "radix": "error",
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "named": "never"
            }
        ],
        "spaced-comment": "error",
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "array-bracket-spacing": [
                        true,
                        "never"
                    ],
                    "block-spacing": true,
                    "brace-style": [
                        true,
                        "1tbs",
                        {
                            "allowSingleLine": true
                        }
                    ],
                    "function-name": [
                        true,
                        {
                            "function-regex": {},
                            "method-regex": {},
                            "private-method-regex": {},
                            "protected-method-regex": {},
                            "static-method-regex": {}
                        }
                    ],
                    "no-boolean-literal-compare": true,
                    "no-else-after-return": true,
                    "no-function-constructor-with-string-args": true,
                    "no-increment-decrement": true,
                    "object-curly-spacing": [
                        true,
                        "always"
                    ],
                    "object-shorthand-properties-first": true,
                    "prefer-array-literal": true,
                    "space-in-parens": [
                        true,
                        "never"
                    ],
                    "ter-arrow-parens": [
                        true,
                        "as-needed",
                        {
                            "requireForBlockBody": true
                        }
                    ],
                    "ter-computed-property-spacing": true,
                    "ter-func-call-spacing": true,
                    "ter-indent": [
                        true,
                        2,
                        {
                            "SwitchCase": 1
                        }
                    ],
                    "ter-prefer-arrow-callback": true,
                    "trailing-comma": [
                        true,
                        {
                            "multiline": "always",
                            "singleline": "never",
                            "esSpecCompliant": true
                        }
                    ],
                    "whitespace": [
                        true,
                        "check-branch",
                        "check-decl",
                        "check-operator",
                        "check-preblock",
                        "check-separator"
                    ]
                }
            }
        ]
    }
};
