const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function expressMiddleware(router) {
  router.use(
    "/site2/public/api",
    createProxyMiddleware({
      target: "https://localhost:39876",
      changeOrigin: true,
      secure: false,
    })
  );
};
