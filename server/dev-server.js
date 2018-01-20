const express = require('express');
const path = require('path');
const opn = require('opn');
const app = express();
const proxyMiddleware = require('http-proxy-middleware');
const isHttps = true
const globalEnv = 'test'
const proxyTable = {
    "/advisor": {
        target: `http${isHttps ? 's' : ''}://advisor-${globalEnv}.0606.com.cn`,
        changeOrigin: true,
        pathRewrite: {
            '^/advisor': ''
        },
        headers: {
            Origin: `http${isHttps ? 's' : ''}://mobile-${globalEnv}.0606.com.cn`,
            Referer: ''
        }
    },
    "/mapi": {
        target: `http${isHttps ? 's' : ''}://mapi-${globalEnv}.0606.com.cn`,
        changeOrigin: true,
        pathRewrite: {
            '^/mapi': ''
        },
        headers: {
            Origin: `http${isHttps ? 's' : ''}://mobile-${globalEnv}.0606.com.cn`,
            Referer: ''
        }
    },
    "/cms": {
        target: `http${isHttps ? 's' : ''}://cms-${globalEnv}.0606.com.cn`,
        changeOrigin: true,
        pathRewrite: {
            '^/cms': ''
        }
    },
    '/bigfund': {
        target: `http${isHttps ? 's' : ''}://bigfund-${globalEnv}.0606.com.cn`,
        changeOrigin: true,
        pathRewrite: {
            '^/bigfund': ''
        }
    },
    '/quant': {
        target: `http${isHttps ? 's' : ''}://quant-${globalEnv}.0606.com.cn`,
        changeOrigin: true,
        pathRewrite: {
            '^/quant': ''
        }

    },
    '/read': {
        target: `http${isHttps ? 's' : ''}://read-${globalEnv}.0606.com.cn`,
        changeOrigin: true,
        pathRewrite: {
            '^/read': ''
        },
        headers: {
            Origin: `http${isHttps ? 's' : ''}://mobile-${globalEnv}.0606.com.cn`,
            Referer: ''
        }
    },
    '/mk/': {
        target: `http${isHttps ? 's' : ''}://mkbj-test.0606.com.cn`,
        changeOrigin: true,
        pathRewrite: {
            '^/mk': ''
        }
    },
    '/broker/': {
        target: `http://localhost:9000`,
        changeOrigin: true,
        headers: {
            // Origin: `http${isHttps ? 's' : ''}://mobile-${globalEnv}.0606.com.cn`,
            Origin: `http${isHttps ? 's' : ''}://mobile-dev2.0606.com.cn`,
            Referer: ''
        }
        // pathRewrite: {
        //     '^/broker': ''
        // }
    },
    '/researchReport': {
        target: `http${isHttps ? 's' : ''}://researchReport-${globalEnv}.0606.com.cn`,
        changeOrigin: true,
        pathRewrite: {
            '^/researchReport': ''
        }
    },
    '/track': {
        target: `http${isHttps ? 's' : ''}://stat-${globalEnv}.0606.com.cn/stat`,
        changeOrigin: true,
        pathRewrite: {
            '^/track': ''
        }
    }
}

const port = '9000'
// 代理遍历
Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    if (typeof options === 'string') {
        options = { target: options };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});
app.use(path.posix.join("/"), express.static('../test'));
app.use(path.posix.join("/", "static"), express.static('../src'));
const uri = 'http://localhost:' + port;

app.listen(port, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    opn(uri)
});
