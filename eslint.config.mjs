import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module"
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            import: importPlugin
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "import/order": [
                "warn",
                {
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true }
                }
            ]
        }
    },

    {
        files: ["frontend/**/*.ts", "frontend/**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./frontend/tsconfig.json",
                ecmaVersion: 2022,
                sourceType: "module",
                ecmaFeatures: { jsx: true }
            }
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            import: importPlugin,
            "@typescript-eslint": tsPlugin
        },
        settings: { react: { version: "detect" } },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn"
        }
    },

    {
        files: ["backend/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./backend/tsconfig.json",
                ecmaVersion: 2022,
                sourceType: "module"
            }
        },
        env: { node: true }
    },

    globalIgnores([
        "node_modules/**",
        "dist/**",
        "build/**",
        "frontend/dist/**"
    ])
]);
