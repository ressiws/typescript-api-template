import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser,
			parserOptions: {
				project: "./tsconfig.json",
				sourceType: "module"
			}
		},
		plugins: {
			"@typescript-eslint": tseslint
		},
		rules: {
			"semi": ["error", "always"],
			"no-console": "error",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error"],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/consistent-type-imports": "error"
		}
	}
];
