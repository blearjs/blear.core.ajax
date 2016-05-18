/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var doc = window.document;
var selector = require('../src/index.js');

describe('测试文件', function () {
    it('.query', function () {
        var oDiv = doc.createElement('div');
        oDiv.setAttribute('id', 'slide1');

        oDiv.innerHTML = '<p>1</p><p>2</p><p>3</p>';

        doc.body.appendChild(oDiv);
        //selector:ele,context:ele
        var selEle1 = selector.query(oDiv, doc);
        //expect(selEle1[0]).toEqual(oDiv);
        //
        ////selector:string,context:ele
        //var selEle2 = selector.query('p','#slide1');
        //console.log(selEle2)
        //expect(selEle2.length).toEqual(3);
        //for(var i=0;i<selEle2.length;i++){
        //    expect(selEle2[i]).toEqual(oDiv.childNodes[i]);
        //}
        //
        ////selector:string,context:ele
        //var selEle3 = selector.query('p',oDiv);
        //expect(selEle3.length).toEqual(3);
        //for(var i=0;i<selEle3.length;i++){
        //    expect(selEle3[i]).toEqual(oDiv.childNodes[i]);
        //}

        doc.body.removeChild(oDiv);
    });

    it('.contains', function () {
        var oDiv1 = doc.createElement('div');
        var oDiv2 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv2.setAttribute('id', 'slide2');
        oDiv1.appendChild(oDiv2);
        doc.body.appendChild(oDiv1);
        //parent:oDiv1
        expect(selector.contains(oDiv2, oDiv1)).toEqual(true);

        //parent:doc
        expect(selector.contains(oDiv1, doc)).toEqual(true);

        doc.body.removeChild(oDiv1);
    });

    it('.siblings', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>1</p><p>2</p><p>3</p>';
        doc.body.appendChild(oDiv1);
        var p1 = selector.query('p', oDiv1)[0];
        var sib = selector.siblings(p1);

        expect(sib[1].innerHTML).toEqual('3');
        expect(selector.siblings().length).toEqual(0);

        doc.body.removeChild(oDiv1);
    });

    it('.index', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>1</p><p id="p2">2</p><p>3</p>';
        doc.body.appendChild(oDiv1);
        var p2 = selector.query('#p2', oDiv1)[0];
        var idx2 = selector.index(p2);

        expect(idx2).toEqual(1);
        expect(selector.index()).toEqual(-1);

        doc.body.removeChild(oDiv1);

    });

    it('.prev', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>1</p><p id="p2">2</p><p>3</p>';
        doc.body.appendChild(oDiv1);
        var p2 = selector.query('#p2', oDiv1)[0];
        var p1 = selector.prev(p2)[0];

        expect(p1.innerHTML).toEqual('1');
        expect(selector.prev().length).toEqual(0);

        doc.body.removeChild(oDiv1);
    });

    it('.next', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>1</p><p id="p2">2</p><p>3</p>';
        doc.body.appendChild(oDiv1);
        var p2 = selector.query('#p2', oDiv1)[0];
        var p1 = selector.next(p2)[0];

        expect(p1.innerHTML).toEqual('3');
        expect(selector.next().length).toEqual(0);

        doc.body.removeChild(oDiv1);
    });

    it('.prevAll', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>0</p><p>1</p><p id="p2">2</p><p>3</p>';
        doc.body.appendChild(oDiv1);
        var p2 = selector.query('#p2', oDiv1)[0];
        var p2PrevAll = selector.prevAll(p2);

        expect(p2PrevAll[1].innerHTML).toEqual('1');
        expect(selector.prevAll().length).toEqual(0);

        doc.body.removeChild(oDiv1);
    });

    it('.nextAll', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>0</p><p>1</p><p id="p2">2</p><p>3</p><p>4</p>';
        doc.body.appendChild(oDiv1);
        var p2 = selector.query('#p2', oDiv1)[0];
        var p2NextAll = selector.nextAll(p2);

        expect(p2NextAll[1].innerHTML).toEqual('3');
        expect(selector.nextAll().length).toEqual(0);

        doc.body.removeChild(oDiv1);
    });

    it('.closest', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');

        var oDiv2 = doc.createElement('div');
        oDiv2.setAttribute('id', 'slide2');

        oDiv1.innerHTML = '<p>0</p><p>1</p><p id="p2">2</p><p>3</p><p>4</p>';
        doc.body.appendChild(oDiv1);
        doc.body.appendChild(oDiv2);

        var p2 = selector.query('#p2', oDiv1)[0];
        var p2Parent_ele = selector.closest(p2, oDiv1);
        var p2Parent_str = selector.closest(p2, '#slide1');
        var p2Parent_empty = selector.closest(p2, '#slide2');

        expect(p2Parent_ele[0]).toEqual(oDiv1);
        expect(p2Parent_str[0]).toEqual(oDiv1);
        expect(p2Parent_empty.length).toEqual(0);
        expect(selector.closest().length).toEqual(0);

        doc.body.removeChild(oDiv1);
    });

    it('.parent', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>0</p><p>1</p><p id="p2">2</p><p>3</p><p>4</p>';
        doc.body.appendChild(oDiv1);
        var p2 = selector.query('#p2', oDiv1)[0];
        var p2Parent = selector.parent(p2, oDiv1);

        expect(p2Parent[0]).toEqual(oDiv1);
        expect(selector.parent().length).toEqual(0);

        doc.body.removeChild(oDiv1);

    });

    it('.children', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>0</p><p>1</p><p id="p2">2</p><p>3</p><p>4</p>';
        doc.body.appendChild(oDiv1);
        var childs = selector.children(oDiv1);

        expect(childs[0].innerHTML).toEqual('0');
        expect(selector.children().length).toEqual(0);

        doc.body.removeChild(oDiv1);

    });

    it('.contents', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>0</p><p>1</p><p id="p2">2</p><p>3</p><p>4</p>';
        doc.body.appendChild(oDiv1);
        var contents = selector.contents(oDiv1);

        expect(contents[0].innerHTML).toEqual('0');
        expect(selector.contents().length).toEqual(0);

        doc.body.removeChild(oDiv1);

    });

    it('.isMatched', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        doc.body.appendChild(oDiv1);
        var isMatched = selector.isMatched(oDiv1,'#slide1');

        expect(isMatched).toEqual(true);

        doc.body.removeChild(oDiv1);

    });

    it('.filter', function () {
        var oDiv1 = doc.createElement('div');
        oDiv1.setAttribute('id', 'slide1');
        oDiv1.innerHTML = '<p>0</p><p>1</p><p id="p2">2</p><p>3</p><p>4</p>';
        doc.body.appendChild(oDiv1);
        var list = selector.query('p', oDiv1);
        var fliterP2 = selector.filter(list, function () {
            return this.innerHTML !== '2'
        });

        expect(fliterP2[2].innerHTML).toEqual('3');

        doc.body.removeChild(oDiv1);

    });

    // it('.has', function () {
    //     var oDiv1 = doc.createElement('div');
    //     oDiv1.setAttribute('id', 'slide1');
    //     oDiv1.innerHTML = '<p>0</p><p>1</p><p id="p2">2</p><p>3</p><p>4</p>';
    //     doc.body.appendChild(oDiv1);
    //     var p1 = selector.query('p', oDiv1)[1];
    //
    //     expect(selector.has(p1, oDiv1)).toEqual(true);
    //     expect(selector.has(p1, '#slide1')).toEqual(true);
    //     expect(selector.has(p1,p1)).toEqual(true);
    //
    //     doc.body.removeChild(oDiv1);
    //
    // });
});
