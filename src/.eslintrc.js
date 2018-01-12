'use strict';

module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "_": false,
        "require": false,
        "__dirname": false,
        "module": false,
        "process": false,
        "describe": false,
        "it": false,
        "before": false,
        "after": false,
        "browser": false,
        "element": false,
        "by": false,
        "exports": false
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
