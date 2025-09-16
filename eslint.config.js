const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

// 🔧 Rule definitions (DRY principle)
const baseRules = {
    // Core quality rules
    "prefer-const": "error",
    "no-var": "error",
    "no-console": "warn",
    "no-debugger": "error",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],

    // Security rules
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",
    "require-await": "error",
};

const jsUnusedVarsRule = {
    "no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
    }]
};

const tsUnusedVarsRules = {
    "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
    }],
    "no-unused-vars": "off", // Use TS version
};

const typescriptRules = {
    // TypeScript specific rules
    "@typescript-eslint/no-unsafe-assignment": "error",

    // Async/Promise safety rules (Critical for production)
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": "error",
};

const reactRules = {
    // React rules
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/exhaustive-deps": "warn",

    // React security rules
    "react/jsx-no-target-blank": "error",
};

// 🔧 Language options (DRY principle)
const baseLanguageOptions = {
    ecmaVersion: 2024,
    sourceType: "module",
};

const tsLanguageOptions = {
    ...baseLanguageOptions,
    parser: require("@typescript-eslint/parser"),
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    },
};

const jsxParserOptions = {
    ecmaFeatures: {
        jsx: true,
    },
};

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
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    // JavaScript files - Base rules
    {
        files: ["**/*.js"],
        languageOptions: baseLanguageOptions,
        rules: {
            ...baseRules,
            ...jsUnusedVarsRule,
        },
    },

    // TypeScript files - Base + TypeScript rules
    {
        files: ["**/*.ts"],
        languageOptions: tsLanguageOptions,
        rules: {
            ...baseRules,
            ...tsUnusedVarsRules,
            ...typescriptRules,
        },
    },

    // React TypeScript files - Base + TypeScript + React rules
    {
        files: ["**/*.tsx"],
        languageOptions: {
            ...tsLanguageOptions,
            parserOptions: {
                ...tsLanguageOptions.parserOptions,
                ...jsxParserOptions,
            },
        },
        rules: {
            ...baseRules,
            ...tsUnusedVarsRules,
            ...typescriptRules,
            ...reactRules,
        },
    },

    // React JavaScript files - Base + React rules
    {
        files: ["**/*.jsx"],
        languageOptions: {
            ...baseLanguageOptions,
            parserOptions: jsxParserOptions,
        },
        rules: {
            ...baseRules,
            ...jsUnusedVarsRule,
            ...reactRules,
        },
    },
];