module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@': './',
            '@types': './types',
            '@constants': './constants',
            '@services': './services',
            '@hooks': './hooks',
            '@context': './context',
            '@components': './components',
            '@screens': './screens',
            '@navigation': './navigation',
            '@utils': './utils',
            '@store': './store',
          },
        },
      ],
    ],
  };
};