import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const config = [
    // Consolidated ignore patterns
    {
        ignores: [
            "node_modules/**", 
            "**/.next/**", 
            "out/**", 
            "build/**", 
            "next-env.d.ts",
            "**/dist/**",
            "**/.vercel/**",
            "**/coverage/**",
            "types/**",
            "next.config.mjs",
            "postcss.config.mjs",
        ],
    },
    
    // Base configuration
    js.configs.recommended,
    
    // Next.js specific rules
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    
    // Custom rules for all files
    {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        parser: tsParser,
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            project: "./tsconfig.eslint.json",
            tsconfigRootDir: __dirname,
        },
    },
    
    rules: {
        // Core quality rules
        "prefer-const": "error",
        "no-var": "error", 
        "no-console": "warn",
        "no-debugger": "error",
        "eqeqeq": ["error", "always"],
        "curly": ["error", "all"],
        
        // Unused variables with underscore prefix allowance
        "no-unused-vars": ["error", {
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "ignoreRestSiblings": true
        }],
        
        // Security rules
        "no-eval": "error",
        "no-implied-eval": "error", 
        "no-new-func": "error",
        "no-script-url": "error",
        
        // TypeScript specific rules
        "@typescript-eslint/no-unsafe-assignment": "error",

        // Async/Promise safety rules (Critical for production)
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "require-await": "error",

        // React rules
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react-hooks/exhaustive-deps": "warn",

        // React security rules
        "react/jsx-no-target-blank": "error",
    },
}];

export default config;