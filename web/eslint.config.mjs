import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import i18next from "eslint-plugin-i18next";

const LAYER_ELEMENTS = [
  { type: "app", pattern: "src/app/**" },
  { type: "screen", pattern: "src/screens/**" },
  { type: "part", pattern: "src/parts/**" },
  { type: "component", pattern: "src/components/**" },
  { type: "page-hook", pattern: "src/hooks/pages/**" },
  { type: "query-hook", pattern: "src/hooks/queries/**" },
  { type: "shared-hook", pattern: "src/hooks/shared/**" },
  { type: "api", pattern: "src/api/**" },
  { type: "mapper", pattern: "src/mappers/**" },
  { type: "auth", pattern: "src/auth/**" },
  { type: "errors", pattern: "src/errors/**" },
  { type: "i18n", pattern: "src/i18n/**" },
  { type: "theme", pattern: "src/theme/**" },
  { type: "config", pattern: "src/config/**" },
  { type: "constant", pattern: "src/constants/**" },
  { type: "type", pattern: "src/types/**" },
  { type: "util", pattern: "src/utils/**" },
];

const LAYER_DEPENDENCIES = {
  app: ["screen", "part", "component", "i18n", "theme", "constant", "type"],
  screen: ["part", "page-hook", "constant", "type", "i18n"],
  part: [
    "part",
    "component",
    "query-hook",
    "shared-hook",
    "mapper",
    "auth",
    "errors",
    "util",
    "config",
    "constant",
    "type",
    "i18n",
  ],
  component: ["component", "util", "constant", "type", "i18n"],
  "page-hook": [
    "query-hook",
    "shared-hook",
    "mapper",
    "auth",
    "errors",
    "util",
    "constant",
    "type",
    "i18n",
  ],
  "query-hook": ["api", "mapper", "errors", "constant", "type"],
  "shared-hook": ["theme", "util", "constant", "type", "i18n"],
  api: ["auth", "errors", "config", "constant", "type"],
  mapper: ["util", "constant", "type"],
  auth: ["util", "config", "constant", "type"],
  errors: ["mapper", "util", "constant", "type"],
  i18n: [],
  theme: [],
  config: ["constant", "type"],
  constant: ["constant"],
  type: ["type"],
  util: ["util", "constant", "type"],
};

const NON_TRANSLATABLE_JSX_ATTRIBUTES = [
  "className",
  "styleName",
  "style",
  "type",
  "variant",
  "mode",
  "tone",
  "padding",
  "size",
  "key",
  "id",
  "width",
  "height",
  "lang",
  "href",
  "src",
  "rel",
  "name",
  "role",
  "align",
  "side",
  "strategy",
  "as",
  "dir",
  "target",
  "method",
  "autoComplete",
  "inputMode",
  "dateTime",
  "scope",
  "aria-current",
  "aria-hidden",
  "aria-expanded",
  "viewBox",
  "fill",
  "stroke",
  "strokeWidth",
  "strokeLinecap",
  "strokeLinejoin",
  "xmlns",
  "d",
];

const ARBITRARY_VALUE_PATTERN = String.raw`(?:^|\s)-?[a-z][a-z0-9-]*-\[[^\]]+\]`;

const NEXT_FILE_CONVENTIONS =
  "src/app/**/{page,layout,template,loading,error,not-found,global-error,default,route}.{ts,tsx}";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "next-env.d.ts", "node_modules/**"]),
  {
    plugins: { boundaries, i18next },
    settings: {
      "boundaries/elements": LAYER_ELEMENTS,
      "boundaries/include": ["src/**/*.{ts,tsx}"],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: Object.entries(LAYER_DEPENDENCIES)
            .filter(([, allow]) => allow.length > 0)
            .map(([from, allow]) => ({
              from: { element: { type: from } },
              allow: { to: { element: { types: { anyOf: allow } } } },
            })),
        },
      ],
      "i18next/no-literal-string": [
        "error",
        {
          mode: "jsx-only",
          "jsx-attributes": { exclude: NON_TRANSLATABLE_JSX_ATTRIBUTES },
        },
      ],
      "max-lines": ["error", { max: 250 }],
      "no-console": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "import/no-default-export": "error",
      "import/no-namespace": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "HTTP lives in src/api only. Reach the network through hooks/queries.",
            },
          ],
        },
      ],
      "react/forbid-dom-props": ["error", { forbid: ["style"] }],
      "react/forbid-component-props": ["error", { forbid: ["style"] }],
      "no-restricted-syntax": [
        "error",
        {
          selector: `JSXAttribute[name.name='className'] > Literal[value=/${ARBITRARY_VALUE_PATTERN}/]`,
          message:
            "No Tailwind arbitrary values. Add a semantic token to theme.css.",
        },
        {
          selector: `JSXAttribute[name.name='className'] > JSXExpressionContainer TemplateElement[value.raw=/${ARBITRARY_VALUE_PATTERN}/]`,
          message:
            "No Tailwind arbitrary values in template literals. Add a semantic token to theme.css.",
        },
        {
          selector: "CallExpression[callee.name='useCallback']",
          message: "No useCallback without profiler proof.",
        },
        {
          selector: "CallExpression[callee.name='useMemo']",
          message: "No useMemo without profiler proof.",
        },
      ],
    },
  },
  {
    files: ["src/api/**/*.ts"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    files: [NEXT_FILE_CONVENTIONS, "*.config.{ts,mts,mjs}"],
    rules: { "import/no-default-export": "off" },
  },
]);

export default eslintConfig;
