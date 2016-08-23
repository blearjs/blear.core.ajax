/**
 * 异步请求 ajax
 * @author zcl
 * 2016-04-12 14:39
 */


'use strict';


var typeis =      require('blear.utils.typeis');
var object =      require('blear.utils.object');
var querystring = require('blear.utils.querystring');
var json =        require('blear.utils.json');
var access =      require('blear.utils.access');
var url =         require('blear.utils.url');
var compatible =  require('blear.utils.compatible');
var fun =         require('blear.utils.function');


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
var noop = fun.noop();

var defaults = {
    /**
     * 请求方法
     * @type string
     */
    method: 'GET',
    // Callback that is executed before request

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
    onProgress: noop,

    /**
     * 期望响应的数据类型
     * @type string
     */
    dataType: 'json',


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
    // Default timeout

    /**
     * 请求超时时间，0为不主动超时
     */
    timeout: 0,

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
     * 异步请求
     * @type boolean
     */
    async: true,

    /**
     * 请求鉴权用户名
     * @type string|null
     */
    username: null,

    /**
     * 请求鉴权密码
     * @type string|null
     */
    password: null
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

    requestURL = url.assignQuery(requestURL, requestQuery);

    var dataType = options.dataType;
    var requestMethod = options.method.toUpperCase();
    var requestBody = options.body;
    var mime = options.accepts[dataType];
    var requestHeaders = object.assign({}, options.headers);
    var abortTimeout;

    if (!options.crossDomain) {
        requestHeaders['x-requested-with'] = 'XMLHttpRequest';
    }

    if (requestMethod === 'GET') {
        requestBody = null;
    }

    if (mime) {
        requestHeaders['accept'] = mime;
        //if (mime.indexOf(',') > -1) {
        //    mime = mime.split(',', 2)[0]
        //}
        xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }

    if (options.contentType &&
        // 不允许重写 formData 的 content-type
        !(requestMethod !== 'GET' && FormData && requestBody && requestBody.constructor === FormData)) {
        requestHeaders['content-type'] = options.contentType || APPLICATION_URLENCODED_MIME;
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
                    err = new Error('parse response text to json:\n' + _err.message);
                }
            }

            if (err) {
                callback(options.onError, err);
            }
            else {
                callback(options.onSuccess, result);
            }
        } else {
            callback(options.onError, err = new Error('response status is ' + responseStatusCode));
        }

        callback(options.onComplete, err);
        cleanup();
    };

    xhr.onabort = function () {
        if (requestAborted) {
            return;
        }

        var err = new Error('request aborted');
        requestAborted = true;
        callback(options.onError, err);
        callback(options.onComplete, err);
        cleanup();
    };

    xhr.onerror = function (eve) {
        var err = new Error(eve.type);
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
        var err = new Error('request aborted');
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
            var err = new Error('request timeout in ' + options.timeout + ' ms');
            callback(options.onError, err);
            callback(options.onComplete, err);
            cleanup();
        }, options.timeout);
    }

    xhr.send(requestBody);
    return xhr;
};


ajax.defaults = defaults;
