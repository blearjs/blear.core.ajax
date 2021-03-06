/**
 * 异步请求 ajax
 * @author zcl
 * @create 2016-04-12 14:39
 * @update 2017年01月17日10:34:48
 */


'use strict';


var typeis = require('blear.utils.typeis');
var object = require('blear.utils.object');
var querystring = require('blear.utils.querystring');
var json = require('blear.utils.json');
var access = require('blear.utils.access');
var url = require('blear.utils.url');
var compatible = require('blear.utils.compatible');
var fun = require('blear.utils.function');


var win = window;
var FormData = win[compatible.js('FormData', win)];
var reMimeJSON = /\/json\b/i;
var reMimeHTML = /\/html\b/i;
var reURLHash = /#.*$/;
var APPLICATION_JSON_MIME = 'application/json';
var TEXT_HTML_MIME = 'text/html';
var TEXT_PLAIN_MIME = 'text/plain';
var APPLICATION_URLENCODED_MIME = 'application/x-www-form-urlencoded';


/**
 * 根据响应 mime 判断数据类型
 * @param mime
 * @returns {*}
 */
var mimeToDataType = function mimeToDataType(mime) {
    if (reMimeJSON.test(mime)) {
        return 'json';
    }

    if (reMimeHTML.test(mime)) {
        return 'html';
    }

    return 'text';
};

// Empty function, used as default callback
var noop = fun.ensure();

var defaults = {
    /**
     * 请求方法
     * @type string
     */
    method: 'GET',

    /**
     * 请求地址
     * @type string
     */
    url: '',

    /**
     * 请求的 url query
     * @type object|string
     */
    query: null,

    /**
     * 请求发送的数据
     * @type object|string
     */
    body: null,

    /**
     * 回调的上下文
     * @type object
     */
    context: null,

    /**
     * 期望响应的数据类型
     * @type string
     */
    dataType: 'json',

    /**
     * 请求数据类型
     */
    contentType: 'application/json',

    /**
     * 允许的响应内容 map
     * @type object
     */
    accepts: {
        json: APPLICATION_JSON_MIME,
        html: TEXT_HTML_MIME,
        text: TEXT_PLAIN_MIME
    },

    /**
     * 是否遵循缓存策略
     * @type boolean
     */
    cache: true,

    /**
     * 是否跨域
     * @type boolean
     */
    crossDomain: false,

    /**
     * 请求超时时间，0为不主动超时
     */
    timeout: 0,

    /**
     * 异步请求
     * @type boolean
     */
    async: true,

    /**
     * 是否重写请求方法，如果设置为 true，则会在非 GET 请求的请求头
     * 里添加 `x-http-method-override` 字段，标记了原始的请求方法
     * @type Boolean
     */
    httpMethodOverride: false,

    /**
     * 请求鉴权用户名
     * @type string|null
     */
    username: null,

    /**
     * 请求鉴权密码
     * @type string|null
     */
    password: null,

    /**
     * 正在发送数据是回调，返回 false 中断请求
     * @type function
     */
    onSend: noop,

    /**
     * 获取到响应内容后回调
     * @type function
     */
    onResponse: noop,

    /**
     * 响应完成并正确处理后回调
     * @type function
     */
    onSuccess: noop,

    /**
     * 响应错误或者未能正确处理响应内容
     * @type function
     */
    onError: noop,

    /**
     * 所有处理已结束后回调
     * @type function
     */
    onComplete: noop,

    /**
     * 请求进度回调
     * @type function
     */
    onProgress: noop
};


/**
 * 发送异步请求
 * @param options
 * @type {Function}
 */
var ajax = module.exports = function (options) {
    options = object.assign({}, defaults, options);

    var cleanup = function () {
        options.onSend = options.onResponse = options.onSuccess =
            options.onError = options.onComplete = options.onProgress = null;
        clearTimeout(abortTimeout);
    };
    var xhr = new window.XMLHttpRequest();
    var callback = function (fn/*arguments*/) {
        if (!typeis.Function(fn)) {
            return;
        }

        var args = access.args(arguments).slice(1);
        args.push(xhr, options);
        fn.apply(options.context, args);
    };

    var requestURL = options.url.replace(reURLHash, '');
    var urlParsed = url.parse(requestURL);
    var requestProtocol = urlParsed.protocol;
    var requestQuery = object.assign({}, options.query);

    if (!options.cache) {
        requestQuery._ = Math.random();
    }

    requestURL = url.setQuery(requestURL, requestQuery);

    var dataType = options.dataType;
    var requestMethod = options.method.toUpperCase();
    var requestBody = options.body;
    var requestContentType = options.contentType;
    var mime = options.accepts[dataType];
    var requestHeaders = object.assign({}, options.headers);
    var abortTimeout;
    var isGET = requestMethod === 'GET';

    if (!options.crossDomain) {
        requestHeaders['x-requested-with'] = 'XMLHttpRequest';
    }

    if (isGET) {
        requestBody = null;
    } else if (options.httpMethodOverride && requestMethod !== 'POST') {
        requestHeaders['x-http-method-override'] = requestMethod;
        requestMethod = 'POST';
    }

    if (mime) {
        requestHeaders['accept'] = mime;
        //if (mime.indexOf(',') > -1) {
        //    mime = mime.split(',', 2)[0]
        //}
        xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }

    if (typeis.Object(requestBody) && !isGET && /\/json/i.test(requestContentType)) {
        requestBody = json.safeStringify(requestBody);
    }

    if (requestContentType &&
        // 不允许重写 formData 的 content-type
        !(!isGET && FormData && requestBody && requestBody.constructor === FormData)) {
        requestHeaders['content-type'] = requestContentType || APPLICATION_URLENCODED_MIME;
    }

    var requestAborted = false;

    xhr.onload = function () {
        if (requestAborted) {
            return;
        }

        // 接收到响应，允许重写响应内容等信息
        callback(options.onResponse);

        var err = null;
        var responseStatusCode = xhr.status;
        var result = xhr.responseText;

        if ((responseStatusCode >= 200 && responseStatusCode < 300) ||
            responseStatusCode === 304 ||
            (responseStatusCode === 0 && requestProtocol === 'file:')) {
            dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));

            if (dataType === 'json') {
                try {
                    result = json.parse(result);
                } catch (_err) {
                    err = new Error('响应数据解析失败\n' + _err.message);
                }
            }

            if (err) {
                callback(options.onError, err);
            }
            else {
                callback(options.onSuccess, result);
            }
        } else {
            callback(options.onError, err = new Error(result || ('响应码为' + responseStatusCode)));
        }

        callback(options.onComplete, err);
        cleanup();
    };

    xhr.onabort = function () {
        if (requestAborted) {
            return;
        }

        var err = new Error('请求被中断');
        requestAborted = true;
        callback(options.onError, err);
        callback(options.onComplete, err);
        cleanup();
    };

    xhr.onerror = function (eve) {
        var errMsg = '网络连接失败';

        switch (xhr.status) {
            case 0:
                errMsg = '请求未成功发送';
                break;
        }

        var err = new Error(errMsg);
        callback(options.onError, err);
        callback(options.onComplete, err);
        cleanup();
    };

    if (xhr.upload && xhr.upload.onprogress) {
        xhr.upload.onprogress = function (eve) {
            callback(options.onProgress, eve);
        };
    }

    if (options.onSend(xhr, options) === false) {
        var err = new Error('请求被取消');
        callback(options.onError, err);
        callback(options.onComplete, err);
        cleanup();
        return false;
    }

    xhr.open(requestMethod, requestURL, options.async, options.username, options.password);

    object.each(requestHeaders, function (key, val) {
        xhr.setRequestHeader(key, val)
    });

    //var xhrAbort = xhr.abort;
    //xhr.abort = function () {
    //    if (requestAborted) {
    //        return;
    //    }
    //
    //    xhrAbort();
    //};


    if (options.timeout > 0) {
        abortTimeout = setTimeout(function () {
            xhr.onload = xhr.onabort = xhr.onerror = null;

            if (xhr.upload) {
                xhr.upload.onprogress = null;
            }

            requestAborted = true;
            xhr.abort();
            var err = new Error('响应在 ' + options.timeout + ' ms 后超时');
            callback(options.onError, err);
            callback(options.onComplete, err);
            cleanup();
        }, options.timeout);
    }

    xhr.send(requestBody);
    return xhr;
};


ajax.defaults = defaults;
