/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var ajax = require('../src/index.js');
var howdo = require('blear.utils.howdo');

describe('测试文件', function () {
    it('base', function (done) {
        ajax({
            url:'/ajax/success/',
            cache:false,
            dataType:'json',
            onSuccess:function(data){
                expect(data.code).toEqual(200);
                done();
            }
        })
    });

    it('error', function (done) {
        ajax({
            url:'/ajax/error/',
            onError:function(err){
                expect(err.message).toEqual('response status is 500');
                //done();
            },
            onComplete:function(err){
                expect(err.message).toEqual('response status is 500');
                done();
            }
        });
    });

    it('abort', function (done) {
        var xhr = ajax({
            url:'/ajax/success/',
            onError:function(err){
                expect(err.message).toEqual('request aborted');
                done();
            }
        });
        xhr.abort();
    });

    it('cache', function (done1) {
        howdo
            .task(function(done2){
                ajax({
                    url:'/ajax/cache/',
                    onSuccess:function(data){
                        done2(null,data);
                    }
                })
            })
            .task(function(done2){
                ajax({
                    url:'/ajax/cache/',
                    cache:false,
                    onSuccess:function(data){
                        done2(null,data);
                    }
                })
            })
            .together(function(err,data1,data2){
                expect(data1.num).not.toEqual(data2.num)
                done1();
            })
    });

    it('datatype', function (done) {
        ajax({
            url:'/ajax/datatype/?json',
            dataType:'',
            onSuccess:function(data){
                expect(data).toEqual('text:json');
                done();
            }
        });
        ajax({
            url:'/ajax/datatype/?html',
            dataType:'',
            onSuccess:function(data){
                expect(data).toEqual('text:html');
                done();
            }
        });
        ajax({
            url:'/ajax/datatype/?text',
            dataType:'',
            onSuccess:function(data){
                expect(data).toEqual('text:text');
                done();
            }
        });
    });

    it('FormData', function (done) {
        var form = new FormData();
        ajax({
            url:'/ajax/success/',
            body:form,
            method:'POST',
            onSuccess:function(data){
                expect(data.code).toEqual(200);
                done();
            }
        });
    });

    it('onSend', function (done) {
        ajax({
            url:'/ajax/success/',
            onSend:function(){
                return false;
            },
            onError:function(err){
                expect(err.message).toEqual('request aborted');
                done();
            }
        });
    });

    it('timeout', function (done) {
        ajax({
            url:'/ajax/timeout/',
            timeout:1,
            onError:function(err){
                expect(err.message).toEqual('request timeout in 1 ms');
                done();
            }
        });
    });

    it('error', function (done) {
        ajax({
            url:'http://www.baidu.com',
            onError:function(err){
                expect(err.message).toEqual('error');
                done();
            }
        });
    });
});