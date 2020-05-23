module.exports = {
    coverageReporters: [
        'lcov',
        'html'
    ],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js'
    ],
    preset: 'ts-jest',
    setupFiles: [],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
