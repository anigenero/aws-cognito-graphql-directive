module.exports = {
    coverageReporters: [
        'lcov',
        'html'
    ],
    coveragePathIgnorePatterns: [
        '\\.(gql|graphql)$',
        '<rootDir>/test',
        '<rootDir>/src/assets/locale'
    ],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js'
    ],
    preset: 'ts-jest',
    setupFiles: [
        '<rootDir>/jest.setup.ts'
    ],
    transform: {
        '\\.(gql|graphql)$': '<rootDir>/jest.graphql.js'
    },
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
