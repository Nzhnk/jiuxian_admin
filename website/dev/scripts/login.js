/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ({

/***/ 14:
/***/ (function(module, exports) {

var wsCache = new WebStorageCache();
$( function(){

	/* 验证 */
	yanzheng();

	/* 注册 */
	register();

	/* 登录 */
	login();

} );

function register(){
	/* 注册 */
	$( '#registerBtn' ).on( 'click', function(){
		let username = $( '#usernameInput' ).val();
		let password = $( '#passwordInput' ).val();
		console.log(username,password)
		/* 获取注册信息 */
		$.ajax( {
			url : '/api/users/isregister',
			method : 'POST',
			data : {
				username,
				password
			},
			success : function( result ){
				console.log( JSON.parse(result) );
				let last = JSON.parse( result ).data
				alert( last.registerRes );
			}
		} );
	} );
};

function login(){
	$( '#checkBtn' ).on( 'click', function(){
		let username = $( '#usernameInput' ).val();
		let password = $( '#passwordInput' ).val();
		console.log(username,password)
		$.ajax( {
			url : '/api/users/loginstate',
			method : 'POST',
			data : {
				username,
				password
			},
			success : function( result ){
				console.log( result )
				let data = JSON.parse( result ).data;
				console.log( data );
				if( data.loginState ){
					// 将token存入本地storage
					wsCache.set( 'token', data.token, { exp : 7200 } );
					wsCache.set( 'username', data.username, { exp : 7200 } );

					location.href = 'index.html';

				} else {
					console.log( "登陆失败！" )
				};
			}
		} );
	} );
};

function yanzheng(){
	// 验证登录状态
	$.ajax( {
		url : "/api/users/islogin",
		headers : {
			"X-Access-Token" : wsCache.get( 'token' )
		},
		success : function( result ){
			let res = JSON.parse( result );
			console.log(res);
			if( res.bgStatus ){
				if( res.data.isLogin ){
					location.href = 'index.html';
				}
			} else {
				alert( '意外错误！' );
			};
		}
	} );
};


/***/ })

/******/ });