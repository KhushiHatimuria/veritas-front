module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for React Native Reanimated functionality.
      'react-native-reanimated/plugin',
      
      // CRITICAL FIX: Direct mapping of modular Firebase imports to the 
      // CommonJS (CJS) distribution to resolve "Unable to resolve" errors 
      // caused by Metro/Firebase ESM conflicts.
      [
        'module-resolver',
        {
          alias: {
            // Map the top-level modular imports used in Chatbot.tsx:
            'firebase/app': './node_modules/firebase/app/dist/index.cjs.js',
            'firebase/auth': './node_modules/firebase/auth/dist/index.cjs.js',
            'firebase/firestore': './node_modules/firebase/firestore/dist/index.cjs.js',
          },
        },
      ],
    ],
  };
};