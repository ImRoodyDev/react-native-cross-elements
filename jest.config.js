const {createDefaultPreset} = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
	testEnvironment: "node",
	transform: {
		...tsJestTransformCfg,
	},
	// Ignore compiled files in dist to prevent Jest from trying to parse ESM imports
	testPathIgnorePatterns: ["<rootDir>/dist/"],
};