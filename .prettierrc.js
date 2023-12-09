const base = require('@tronite/prettier-config');

module.exports = {
  ...base,
  plugins: [...base.plugins, 'prettier-plugin-packagejson'],
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
};
