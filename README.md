## JSONRpc

jsonrpc for jQuery plugin


### 构造函数以及参数: 

	new JSONRpc(methods, url);

params:

* methods (array): 请求方法列表

* url (string): 请求地址

### 使用: 

	var jsonrpc = new JSONRpc(['test.get', 'test.set'], 'json-rpc');

	//异步请求
	jsonrpc.test.get(function(result, error) {
		alert(result);
	});
	jsonrpc.test.set(function(result, error) {
		alert(result);
	}, request);

	//同步请求
	var result = jsonrpc.test.get();
	var result = jsonrpc.test.set(request);


___

### author: 

* 邮箱: wenzhixin2010@gmail.com

* 微博: <a href="http://weibo.com/2292826740">@_文翼_</a> 
