module.exports = {
  moduleFileExtensions: ["js", "ts"],
  moduleDirectories: ["node_modules", "src", "test"],
  moduleNameMapper: {
    "src/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "\\.(js|jsx|ts|tsx)$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", jsx: true, decorators: true },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            react: { runtime: "automatic" },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  collectCoverage: false,
  testMatch: ["<rootDir>/test/**/*.test.ts"],
};
