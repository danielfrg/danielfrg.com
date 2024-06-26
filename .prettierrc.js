/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: [require.resolve("prettier-plugin-astro")],

  printWidth: 100,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",

  overrides: [
    {
      files: [".*", "*.json", "*.md", "*.mdx", "*.toml", "*.yml"],
      options: {
        useTabs: false,
      },
    },
    {
      files: ["**/*.astro"],
      options: {
        parser: "astro",
      },
    },
  ],
};
