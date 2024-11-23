import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import stylisticJs from '@stylistic/eslint-plugin-js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {globals: {...globals.browser, ...globals.node}},
        plugins: {
            unicorn: eslintPluginUnicorn,
            '@stylistic/js': stylisticJs
        },
        rules: {
            '@stylistic/js/semi': ['error'],
            '@stylistic/js/indent': ['error', 4]
        }
    },
    pluginJs.configs.recommended,
];