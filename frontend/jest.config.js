module.exports = {
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    // '.+\\.(css|styl|less|sass|scss)$': 'jest-transform-css'
  },
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'jest-transform-stub'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
