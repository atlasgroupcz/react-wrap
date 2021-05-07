module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': ['babel-jest', { configFile: './babelrc.tests.json' }],
    },
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less|scss)$':
            '<rootDir>/tests/__mocks__/staticMock.js',
    },
    // setupFiles: ['./tests/config/setupTests.js'],
};
