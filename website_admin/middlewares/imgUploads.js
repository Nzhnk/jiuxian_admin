const multer = require( 'multer' );
const path = require( 'path' );

let fileName = '';
const storage = multer.diskStorage( {
	destination : ( req, file, callback ) => {
		callback( null, path.resolve( __dirname, '../public/imgUploads/' ) );
	},/*设置图片的上传文件夹*/
	filename : ( req, file, callback ) => {
		fileName = file.fieldname + '-' + new Date().getTime() + '.' + getExtention( file.originalname );
		callback( null, fileName );
	}/*设置上传图片的命名*/
} );

/*设置上传图片的格式*/
const imgFilter = ( req, file, callback ) => {
	if( file.originalname.match( /\.(png|jpg|jpeg|gif)$/i ) ){
		callback( null ,true );
	} else {
		callback( new Error( '仅支持图片！（png,jpg,jpeg,gif）' ) );
	};
};

/*获取后缀名*/
function getExtention( str ) {
	const ext = str.split( '.' );
	return ext[ ext.length - 1 ];
};

const imgUpload = ( fieldName ) => {
	return ( req, res, next ) => {
		res.set( 'Content-Type', 'application/json; charset=utf-8;' );
		const upload = multer( { storage, imgFilter } ).single( fieldName );
		upload( req, res, ( err ) => {
			if( err ){
				res.render( 'products/faile.ejs', {
					errMsg : err.message
				} );
			} else {
				req.fileName = fileName;
				next();
			};
		} );
	};
};

module.exports = imgUpload;