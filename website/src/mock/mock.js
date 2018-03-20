const isLogin = require( './isLogin.json' );
const isRegister = require( './isRegister.json' );
const loginState = require( './loginState.json' );

module.exports = () => {
	return {
		isLogin,
		isRegister,
		loginState
	};
};