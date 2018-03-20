const jwt = require( 'jsonwebtoken' );
const path = require( 'path' );
const fs = require( 'fs' );

const verifyToken = ( req, res, next ) => {
	const token = req.header( 'X-Access-Token' );
	const publicKey = fs.readFileSync( path.resolve( __dirname, '../key/public.key') );
	jwt.verify( token, publicKey, function( err, decoded ) {
		if( err ){
			res.render( 'login/isLogin.ejs', {
				isLogin : false,
				loginRes : err.message
			} );
		} else {
			req.username = decoded.username;
			next();
		};
	} );
};

module.exports = verifyToken;