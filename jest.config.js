module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  globalSetup: "<rootDir>/jest.global-setup.ts",
};
