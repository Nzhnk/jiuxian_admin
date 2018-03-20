const mongoose = require( 'mongoose' );

mongoose.connect( 'mongodb://localhost:27017/website_admin', function(){
	console.log("管理员集合OK！")
} );

module.exports = mongoose;