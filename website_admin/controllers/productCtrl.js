const productsModel = require( '../models/product.js' );
require( '../utils/date.format.js' );

const add = async ( req, res, next ) => {
	res.set('Content-Type', 'application/json; charset=utf8')
	let result = await productsModel.add( {
		...req.body,
		productLogo : req.fileName,
		createTime: new Date().Format('yyyy-MM-dd hh:mm')
	} );
	if( result ){
		res.render( 'products/success.ejs', {
			data : JSON.stringify( result )
		} );
	} else {
		res.render( 'products/faile.ejs', {
			errMsg : "商品添加失败！"
		} );
	};
};

const list = async ( req, res, next ) => {
	res.set('Content-Type', 'application/json; charset=utf-8')
	let dataTotal = await productsModel.findAll();
	let total = dataTotal.length;
	let pageSize = 5;
	let limit = pageSize;

	let pagination = parseInt( req.params.pagination , 10 );
	let skip = pagination * pageSize;
	console.log(skip)
	const result = await productsModel.list( {
		limit,
		skip
	} );
	if( result ){
		res.render( 'products/success.ejs', {
			data : JSON.stringify( {
				result,
				pageSize,
				pagination,
				total
			} )
		} );
	} else {
		res.render( 'products/faile.ejs', {
			errMsg : "获取数据失败！请稍后重试！"
		} );
	};
};

async function remove( req, res, next ){
	res.set( 'Content-Type', 'application/json; charset=utf-8' );
	let id = req.params.productId;
	let result = await productsModel.remove( id );
	if( result ){
		res.render( 'products/success.ejs', {
			data : true
		} );
	} else {
		res.render( 'products/faile.ejs', {
			errMsg : "删除失败！~"
		} );
	};
};

/*编辑*/
async function edit( req, res, next ){
 	res.set( 'Content-Type', 'application/json; charset=utf-8' );//这里要注意，utf-8后面不能加；号

	// res.set( 'Content-Type', 'application/json; charset=utf-8;' );
	let id = req.params.productId;
	// 查找
	let result = await productsModel.edit( {
		id,
		...req.body,
		productLogo : req.fileName,
		createTime : new Date().Format('yyyy-MM-dd hh:mm')
	} );
	if( result ){
		console.log(1)
		res.render( 'products/success.ejs', {
			data : JSON.stringify( {
				"resMsg" : true
			} )
		} );
	} else {
		res.render( 'products/faile.ejs', {
			errMsg : false
		} );
	};
};

/* 查找单个 */
async function single ( req, res, next ){
	res.set( 'Content-Type', 'application/json; charset=utf-8' );
	let productId = req.params.productId;
	let result = await productsModel.single( productId );
	if( result ){
		res.render( 'products/success.ejs', {
			data : JSON.stringify( result )
		} );
	};
};


/* 搜索 */
async function search( req, res, next ){
	res.set( 'Content-Type', 'application/json; charset=utf-8' );
	let keywords = req.body.keywords;
	let result = await productsModel.search( keywords );
	console.log(result);
	if( result ){
		res.render( 'products/success.ejs', {
			data : JSON.stringify( result )
		} );
	} else {
		res.render( 'products/faile.ejs', {
			errMsg : "(＞人＜)，没有该数据~"
		} );
	};
};
module.exports = {
	add,
	list,
	remove,
	edit,
	single,
	search
};