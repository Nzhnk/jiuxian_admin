const DB_cnt = require( './connect.js' );

const UsersDb = DB_cnt.model( 'Users_web', {
	username : String,
	password : String
} );


// 存入数据库
const addUser = ( { username, password, callback } ) => {
	UsersDb.find( { username } )
	.then( ( result ) => {
		if( result.length > 0 ){
			callback( {
				result : false,
				resMsg : "用户名已存在！"
			} );
		} else {
			new UsersDb( { username, password } )
			.save()
			.then( () => {
				callback( {
					result : true,
					resMsg : "注册成功！请登录!"
				} )
			} )
			.catch( () => {
				callback( {
					result : false,
					resMsg : "注册失败！"
				} );
			} );
		};
	} )
	.catch( () => {
		callback( {
			result : false,
			resMsg : "出现意外错误，请稍后再试！"
		} );
	} );
};

// 查找
const findUser = ( { username, callback } ) => {
	UsersDb.findOne( { username } )
	.then( ( result ) => {
		if( result ){
			callback( {
				result : result,
				resMsg : "存在该用户"
			} );
		} else {
			callback( {
				result : false,
				resMsg : "密码错误！"
			} );
		}
	} )
	.catch( () => {
		callback( {
			result : false,
			resMsg : "查找错误！"
		} );
	} );
};

// 暴露方法
module.exports = {
	addUser,
	findUser
};