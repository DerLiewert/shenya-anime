const path = require('path');

module.exports = {
  style: {
    sass: {
      loaderOptions: {
        additionalData: `
            @use 'sass:math';
            @use "src/styles/variables" as *;
            @use "src/styles/mixins" as *;
          `,
      },
    },
  },

  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
