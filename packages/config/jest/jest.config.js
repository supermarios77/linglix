module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setup-tests.ts"], // we'll create this next
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // mock styles
    "^@/(.*)$": "<rootDir>/src/$1", // adjust to your path aliases
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json", // or shared tsconfig
    },
  },
  // Optional: collect coverage in CI
  collectCoverage: process.env.CI === "true",
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
};
