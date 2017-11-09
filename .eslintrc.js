module.exports = {
  "env": {
      "browser": true,
      "commonjs": true,
      "es6": true,
      "node": true
  },
  "extends": "eslint:recommended",
  "plugins": ["html"],
  "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": 6,
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true
      }
  },
  "rules": {
      "indent": [
          "error",
          4
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "never"
      ],
       "no-console": 0,
       "no-debugger": 0,
       "prefer-spread": 0
  },
  "globals": {
      "__DEV__": 2,
      "__PROD__": 2,
      "__DEBUG__": 0,
      "__COVERAGE__": 2,
      "__BASENAME__": 2,
      "__service": 0,
      "__dirname": 0
  }
};
