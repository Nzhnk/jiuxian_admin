const DB_cnt = require( './admin/connect.js' );

const Product = DB_cnt.model( 'product', {
	productNamezh : {
		type : String,
		reqiured : true
	},
	productNameen : {
		type : String,
		reqiured : true
	},
	productLogo : {
		type : String,
		reqiured : true
	},
	productPrice : {
		type : String,
		reqiured : true
	},
	productUses : {
		type : String,
		reqiured :true
	},
	createTime : {
		type : String,
		reqiured : true
	}
} );

const add = ( { productNamezh, productNameen, productPrice, productUses, productLogo, createTime } ) => {
	return new Product( {
		productNamezh,
		productNameen,
		productPrice,
		productUses,
		productLogo,
		createTime
	} )
	.save()
	.then( ( result ) => {
		return result;
	} )
	.catch( ( err ) => {
		console.log( err.message );
		return false;
	} );
};

const findAll = () => {
	return Product.find()
	.then( ( result ) => {
		return result;
	} )
	.catch( ( err ) => {
		console.log( err );
		return false;
	} );
};

const list = ( { limit, skip } ) => {
	return Product.find().sort( { _id : -1 } ).limit( limit ).skip( skip )
	.then( ( result ) => {
		return result;
	} )
	.catch( ( err ) => {
		console.log( err.message );
		return false;
	} );
};

const remove = ( id ) => {
	return Product.findByIdAndRemove( id )
	.then( ( result ) => {
		return result;
	} )
	.catch( ( err ) => {
		console.log( err.message );
		return false;
	} );
};

function edit( { id, productNamezh, productNameen, productLogo, productPrice, productUses, createTime } ){
	let update = productLogo ? { productNamezh, productNameen, productLogo, productPrice, productUses, createTime } : { productNamezh, productNameen, productPrice, productUses, createTime };
	return Product.findByIdAndUpdate( id, update )
	.then( ( result ) => {
		return true;
	} )
	.catch( ( err ) => {
		console.log( err.message );
		return false;
	} );
};

const single = ( id ) => {
	return Product.findById( id )
	.then( ( result ) => {
		return result;
	} )
	.catch( ( err ) => {
		console.log( err.message );
		return false;
	} );
};

function search( keywords ){
	let reg = new RegExp( keywords, 'i' );
	//Model.find({"$or" :  [ {‘age’:18} , {‘name’:‘xueyou’} ] }); 查询 age等于18 或 name等于’xueyou’ 的文档
	console.log(keywords, reg);
	return result = Product.find( {
		'$or' : [
			{ 'productNamezh' : { $regex : reg } },
			{ 'productNameen' : { $regex : reg } },
			{ 'productUses' : { $regex : reg } },
			{ 'productPrice' : { $regex : reg } }
		]
    } )
    .then( ( result ) => {
    	return result;
    } )
    .catch( ( err ) => {
    	console.log(err);
    	return false;
    })
};

module.exports = {
	findAll,
	add,
	list,
	remove,
	edit,
	single,
	search
};