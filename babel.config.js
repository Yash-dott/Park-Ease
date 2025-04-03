module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@constants': './src/constants',
          '@components': './src/components',
          '@assets': './src/assets',
          '@helpers': './src/helpers',
          '@screens': './src/screens',
          '@services': './src/services',
          '@types': './src/types',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg'],
      },
    ],
    ['react-native-reanimated/plugin'],
  ]
};
