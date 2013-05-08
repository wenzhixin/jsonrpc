/**
 * author: zhixin wen <wenzhixin2010@gmail.com>
 */

/**
 * params:
 *   	methods: array
 * 	url: 'json-rpc'
 * 
 * use: 
 * 	var jsonrpc = new JSONRpcClient(['test.get', 'test.set'], 'json-rpc');
 * 
 * 	jsonrpc.test.get(function(result, error) {
 * 		alert(result);
 *  	});
 * 	jsonrpc.test.set(function(result, error) {
 * 		alert(result);
 *  	}, request);
 * 
 * 	var result = jsonrpc.test.get();
 *  	var result = jsonrpc.test.set(request);
 * 
 */ 
 
	
function JSONRpc(url, methods) {

	var createFunc = function(method) {
		/**
		 * request: {
		 * 		params: params,
		 * 		appendUrl: append to url
		 * }
		 */
		return function(callback, request) {
			var async = true;
			if (typeof callback != 'function') {
				async = false;
				request = callback;
				callback = null;
			}
			var result = null;
			var params, 
				newUrl = url;
			if (request) {
				if (request.hasOwnProperty('params') && request.hasOwnProperty('appendUrl')) {
					params = request.params;
					newUrl += '/' + request.appendUrl;
				}
				else if (request.hasOwnProperty('params')) {
					params = request.params;
				}
				else if (request.hasOwnProperty('appendUrl')) {
					newUrl += '/' + request.appendUrl;
				}
				else {
					params = request;
				}
			}
			var obj = {
				jsonrpc: '2.0',
			  	id: JSONRpc.requestID++,
			  	method: method,
			  	params: params
			};
			$.ajax({
				url: newUrl,
				type: 'POST',
				contentType: 'application/json-rpc',
				data: JSON.stringify(obj),
				async: async,
				success: function(data) {
					result = data.hasOwnProperty('result') ? data.result : null;
					var error = data.hasOwnProperty('error') ? data.error : null;
					if (callback) callback(result, error);
				},
				error: function(XMLHttpRequest, textStatus) {
					if (callback) callback(XMLHttpRequest.status);
				}
			});
			return result;
		};
	};
	
	for (var i = 0; i < methods.length; i++) {
		var method = methods[i];
		var tmpArr = method.split('.');
		var funcArr = new Array();
		for (var j = 0; j < tmpArr.length; j++) {
			if (tmpArr[j] != '') {
				funcArr.push(tmpArr[j]);
			}
		}
		if (funcArr.length == 1) {
			this[funcArr[0]] = createFunc(method);
		}
		else {
			if (!this.hasOwnProperty(funcArr[0])) {
				this[funcArr[0]] = new Object();
			}
			var methodObj = this[funcArr[0]];
			for (var j = 1; j < funcArr.length - 1; j++) {
				if (!methodObj.hasOwnProperty(funcArr[j])) {
					methodObj[funcArr[j]] = new Object();
				}
				methodObj = methodObj[funcArr[j]];
			}
			methodObj[funcArr[funcArr.length - 1]] = createFunc(method);
		}
	}
};
JSONRpc.requestID = 1;
