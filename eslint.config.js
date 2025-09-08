const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [
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
            "**/types/**",
            "**/*.config.js",
            "**/*.config.mjs",
        ],
    },
    
    // Base configuration
    js.configs.recommended,
    
    // Next.js specific rules
    ...compat.extends("next/core-web-vitals"),
    
    // Custom rules for all files
    {
    languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
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
        
        // React rules
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react-hooks/exhaustive-deps": "warn",
    },
}];