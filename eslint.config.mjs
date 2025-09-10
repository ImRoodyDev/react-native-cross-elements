import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import {defineConfig} from "eslint/config";
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
	// Base JavaScript recommended rules
	js.configs.recommended,
	// TypeScript recommended rules
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	// React plugin configuration
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		plugins: {'react-hooks': reactHooks},
		languageOptions: {globals: globals.browser},
		rules: {
			'react/prop-types': 'warn',
			'react-hooks/exhaustive-deps': 'warn',
			'react-hooks/rules-of-hooks': 'error',
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-expressions": 'off'
		},
		settings: {
			react: {
				version: "detect", // Automatically detects the React version
			},
		},
	},
	// ⚡️ NEW: Configuration for CommonJS files like babel.config.js
	{
		files: ["babel.config.js"],
		languageOptions: {
			sourceType: "commonjs",
			ecmaVersion: 2018, // Use a modern ECMAScript version
		}
	},
	{
		files: ["jest.config.js"],
		languageOptions: {
			sourceType: "commonjs",
			ecmaVersion: 2018,
			globals: {
				require: "readonly",
				module: "readonly"
			}
		},
		rules: {
			"@typescript-eslint/no-require-imports": "off",
			"no-undef": "off"
		}
	},
	{
		ignores: ['**/node_modules/**', '**/docs/**', '**/dist/**', '**/build/**', '**/.git/**', '**/.cache/**', '**/coverage/**']
	}
]);
