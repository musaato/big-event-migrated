// import { createProxyMiddleware } from 'http-proxy-middleware';
const { legacyCreateProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        // '/api',
        //  To solve CORS error
        legacyCreateProxyMiddleware('/api', {
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: { '/api': '' }
        })
    );
    /*     app.use(
            '/resource',
            createProxyMiddleware({
                target: 'http://localhost:8080',
                changeOrigin: true,
            })
        ); */
};