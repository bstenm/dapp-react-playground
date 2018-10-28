// [REF]: https://medium.freecodecamp.org/these-tools-will-help-you-write-clean-code-da4b5401f68e
module.exports = {
	env: {
		es6: true,
		browser: true,
		node: true,
	},
	extends: [
            'airbnb',
            'plugin:jest/recommended',
            'jest-enzyme'
      ],
	plugins: [
		'babel',
		'import',
		'jsx-a11y',
		'react',
		'prettier',
	],
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	},
	rules: {
            "indent": ["error", 6],
            "prettier/prettier": "error",
	}
};