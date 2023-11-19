module.exports = {
  ...require("@tronite/prettier-config"),
  importOrder: ["<THIRD_PARTY_MODULES>", "@tarrasque/(.*)$", "^[./]"],
};
