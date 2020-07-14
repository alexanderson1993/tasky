module.exports = {
  globDirectory: "dist/browser",
  globPatterns: [
    "**/*.{html,js,css,png,svg,jpg,gif,json,woff,woff2,eot,ico,webmanifest,map}",
  ],
  swDest: "dist/browser/service-worker.js",
  clientsClaim: true,
  skipWaiting: true,
};
