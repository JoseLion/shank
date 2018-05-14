module.exports = {
  SHANK_VIRTUAL_DOCUMENTS: process.env.SHANK_VIRTUAL_DOCUMENTS || "http://localhost:3010/shank",
  STATIC_FILES: "../server/public/shank",
  DOMAIN: process.env.DOMAIN || "http://localhost:3010"
};