module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ["./test/setup.ts"],
};
