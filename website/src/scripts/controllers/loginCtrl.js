const loginView = require( '../views/login.html' );
const modalView = require( '../views/modal.html' );
const userinfoView = require( '../views/userInfo.html' );
var wsCache = new WebStorageCache();

// 渲染模板
const render = () => {
	// 验证登录状态
	$.ajax( {
		url : "/api/users/islogin",
		headers : {
			"X-Access-Token" : wsCache.get( 'token' )
		},
		success : function( result ){
			console.log(result);
			const data = JSON.parse( result ).data;
			if( data.isLogin ){
				$( '#modal' ).css( 'display', 'none' );
				// 渲染登录模板
				let loginTpl = template.render( loginView, {
					isLogin : data.isLogin,
					username : data.loginRes
				} );
				$( '.control_self' ).before( loginTpl );

				let userinfoTpl = template.render( userinfoView, {
					username : data.loginRes
				} );
				$( '#username_person' ).html( userinfoTpl );
				// TODO
				changeBtnInfo();
				judgeEvent();
			} else {
				// let modalTpl = template.render(  );
				$( '#modal' ).html( modalView );
				$( '#modal' ).css( 'display', 'block' );

				let second = $( '#to_login b' ).text();
				let timer = null;
				clearInterval( timer );
				timer = setInterval( function(){
					if( second >= 1 ){
						second -= 1;
						$( '#to_login b' ).html( second );
					} else {
						clearInterval( timer );
						location.href = 'login.html';
					};
				}, 1000 );
				$( '#to_loginBtn' ).on( 'click', function(){
					clearInterval( timer );
					location.href = 'login.html';
				} );
			};
		}
	} );
};

// 修改按钮信息
const changeBtnInfo = () => {
	$( '#login_user' ).on( 'click', ( e ) => {
		$( '#username' ).val( '' );
		$( '#password' ).val( '' );
		let btnInfo = $( e.target ).text();
		switch( btnInfo ){
			case '注册' :
				$( '#btn_info' ).text( '注册' );
				break;
			case '登录' :
				$( '#btn_info' ).text( '登录' );
				break;
			default :
				$( '#btn_info' ).text( '注销' );
				break;
		};
	} );
};

// 判断事件
const judgeEvent = () => {
	let btn = $( '#btn_info' );
	btn.on( 'click', () => {
		let btnInfo = $( '#btn_info' ).text();
		switch( btnInfo ){
			case '注册' :
				doRegister();
				break;
			case '登录' :
				doLogin();
				break;
			case '注销' :
				doLoginOut();
				break;
			default : break;
		};
	} );
};



// 注册事件
const doRegister = () => {
	const username = $( '#username' ).val();
	const password = $( '#password' ).val();
	$.ajax( {
		url : '/api/users/isregister',
		method : 'POST',
		data : {
			username,
			password
		},
		success : function( result ){
			console.log( result );
		}
	} );
};

const doLogin = () => {
	const username = $( '#username' ).val();
	const password = $( '#password' ).val();
	$.ajax( {
		url : '/api/users/loginstate',
		method : 'POST',
		data : {
			username,
			password
		},
		success : function( result ){
			console.log(result);
			let data = JSON.parse( result ).data;
			if( data.loginState ){
				// 将token存入本地storage
				wsCache.set( 'token', data.token, { exp : 7200 } );
				wsCache.set( 'username', data.username, { exp : 7200 } );

				// 强制刷新
				// location.reload();
			} else {
				console.log( "登陆失败！" )
			};
		}
	} );
};

const doLoginOut = () => {
	wsCache.delete( 'token' );
	wsCache.delete( 'username' );
	location.href = 'login.html';
};

module.exports = {
	render
};