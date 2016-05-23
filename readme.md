# blear.core.ajax

[![npm module][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![coverage][coveralls-img]][coveralls-url]

[travis-img]: https://img.shields.io/travis/blearjs/blear.core.ajax/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/blearjs/blear.core.ajax

[npm-img]: https://img.shields.io/npm/v/blear.core.ajax.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/blear.core.ajax

[coveralls-img]: https://img.shields.io/coveralls/blearjs/blear.core.ajax/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/blearjs/blear.core.ajax?branch=master

## `ajax(options)`
```
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
```
