module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "jsdom",
  preset: 'ts-jest',
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true
      }
    }
  },
  "moduleNameMapper": {
    "\\.(css|less)$": "identity-obj-proxy",
    "^@api(.*)$": "<rootDir>/src/api/$1",
    "^@components(.*)$": "<rootDir>/src/components/$1",
    "^@common(.*)$": "<rootDir>/src/components/common/$1",
    "^@Header(.*)$": "<rootDir>/src/components/Header.tsx",
    "^@PrivateRoute(.*)$": "<rootDir>/src/components/PrivateRoute.tsx",
    "^@context(.*)$": "<rootDir>/src/context/$1",
    "^@reducers(.*)$": "<rootDir>/src/reducers/$1",
    "^@Routes(.*)$": "<rootDir>/src/routes/Routes.tsx",
    "^@Types(.*)$": "<rootDir>/src/types/index.tsx",
    "^@assets(.*)$": "<rootDir>/src/assets/$1",
    "^@Lang(.*)$": "<rootDir>/src/assets/lang.tsx",
    "^@Utils(.*)$": "<rootDir>/src/utils.tsx",
    "^@App(.*)$": "<rootDir>/src/components/App.tsx",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(lodash-es|other-es-lib))"],
  // Setup Enzyme
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFilesAfterEnv: ['<rootDir>/src/setupEnzyme.tsx'],
};
