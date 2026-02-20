import sharedPreset from "@repo/jest-config/jest.config.js";

export default {
  ...sharedPreset,
  roots: ["<rootDir>/"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setup-tests.ts"],
};
