# blear.core.ajax

[![Build Status][travis-img]][travis-url] 

[travis-img]: https://travis-ci.org/blearjs/blear.core.ajax.svg?branch=master
[travis-url]: https://travis-ci.org/blearjs/blear.core.ajax

## `.query(selector<String,Node>, [context<Node>])`
在上下文里根据元素选择器查找元素，返回数组。


## `.contains(childEl, parentEl)`
判断 childEl 是否被 parentEl 包含。


## `.siblings(el)`
返回 el 元素的兄弟元素数组。


## `.index(el)`
返回 el 元素在兄弟元素中的索引值。


## `.prev(el)`
返回 el 元素的前面的一个元素数组。


## `.next(el)`
返回 el 元素的后面的一个元素数组。


## `.prevAll(el)`
返回 el 元素的前面的所有元素数组。


## `.nextAll(el)`
返回 el 元素的后面的所有元素数组。



## `.closest(el, selector)`
从 el 元素本身开始获得最近匹配的祖先元素数组。


## `.parent(el)`
返回 el 元素的父级元素数组。


## `.children(el)`
返回 el 元素的子级元素数组。


## `.contents(el)`
返回 el 元素的子节点数组。



## `.isMatched(el, sel)`
判断元素是否匹配选择器。


## `.filter(nodeList, filter)`
根据 filter 函数过滤 nodeList （类）数组



