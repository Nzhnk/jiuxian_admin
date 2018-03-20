const loginModel = require( '../../models/admin/login.js' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const fs = require( 'fs' );
const path = require( 'path' );

// 是否登录
const isLogin = ( req, res, next ) => {
	// 用户验证
	res.render( 'login/isLogin.ejs', {
		isLogin : true,
		loginRes : req.username
	} );
};

// 注册
const isRegister = ( req, res, next ) => {
	const username = req.body.username;
	const password = req.body.password;

	bcrypt.hash( password, 10 )
	.then( ( bcryptPassword ) => {
		loginModel.addUser( { username, password : bcryptPassword, callback : ( result ) => {
			if( result ){
				res.render( 'login/isRegister.ejs', {
					isRegister : result.result,
					registerRes : result.resMsg
				} );
			} else {
				res.render( 'login/isRegister.ejs', {
					isRegister : result.result,
					registerRes : result.resMsg
				} );
			};
		} } );
	} );
};

// 状态
const loginState = ( req, res, next ) => {
	const username = req.body.username;
	const password = req.body.password;

	loginModel.findUser( { username, password, callback : ( result ) => {
		if( result.result ){
			bcrypt.compare( password, result.result.password )
			.then( ( comparePassword ) => {
				if( comparePassword ){
					res.render( 'login/loginState.ejs', {
						loginState : true,
						username : username,
						token : setToken( username, password )
					} );
				} else {
					res.render( 'login/loginState.ejs', {
						loginState : false,
						username : "",
						token : ""
					} );
				};
			} )
			.catch( (e) => {
				console.log(e)
				res.render( 'login/loginState.ejs', {
					loginState : false,
					username : "",
					token : "1"
				} );
			} );
		} else {
			res.render( 'login/loginState.ejs', {
				loginState : false,
				username : "",
				token : ""
			} );
		};
	} } );

};

// 设置token
const setToken = ( username, password ) => {
	const payload = {
		username,
		password
	};
	const privateKey = fs.readFileSync( path.resolve( __dirname, '../../key/private.key' ) );
	const token = jwt.sign( payload, privateKey, { algorithm : 'RS256' } );
	return token;
};

// 暴露方法
module.exports = {
	isLogin,
	isRegister,
	loginState
};