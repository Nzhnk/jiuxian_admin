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
