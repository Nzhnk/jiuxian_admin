const productListView = require( '../views/productList.html' );
const productAddView = require( '../views/productAdd.html' );
const paginationView = require( '../views/pagination.html' );
const productEditView = require( '../views/productEdit.html' );

// 渲染模板
const render = async ( pagination ) => {
	pagination = parseInt( pagination || 0, 10 );
	let result = await renderProductList( pagination );
	if( result.bgState ){
		let { pageSize, total } = result.data;
		let pageSum = Math.ceil( total / pageSize );
		if( pagination < pageSum && pagination >= 0 ){
			let productListTpl = template.render( productListView, {
				data : result.data.result,
				pagination
			} )
			$( '.content' ).html( productListTpl );

			renderProductPagination( { pagination, pageSum, pageSize } );

			/*删除请求*/
			remove( pagination );

			/*搜索*/
			search();
		} else {
			location.hash = `/products/${pagination - 1}`;
		};
	};
};

/* 渲染商品列表 */
function renderProductList( pagination ){
	pagination = parseInt( pagination || 0, 10 );
	return $.ajax( {
		url : `/api/products/list/${pagination}`,
	} )
	.then( ( result ) => {
		return result;
	} )
	.fail( ( err ) => {
		console.log( err );
		return false;
	} );
};

/* 分页器 */
function renderProductPagination( { pagination, pageSum, pageSize } ){
	let paginationTpl = template.render( paginationView, { pagination, pageSum, pageSize } );
	$( '#pagination' ).html( paginationTpl );
};

function remove( pagination ){
	$( '.btn-warning' ).on( 'click', async function(){
		if( confirm( '您真的要删除该数据吗？' ) ){
			let productId = $( this ).attr( 'id' );
			let result = await removeProduct( productId );
			if( result.bgState ){
				if( result.data ){
					render( pagination );
				} else {
					alert( '删除失败！出现意外错误！' );
				};
			} else {
				alert( '服务器出小差了~，请稍后重试~' );
			};
		};
	} );
};

/* 删除时发送的请求 */
function removeProduct( productId ) {
	return $.ajax( {
		url : `/api/products/remove/${productId}`
	} )
	.then( ( result ) => {
		return result;
	} )
	.fail( ( err ) => {
		console.log( err.message );
		return false;
	} );
};

/* add */
function add(){
	$( '.content' ).html( productAddView );

	$( '#addSubmit' ).off( 'click' ).on( 'click', function(){

		let options = {
			"success" : function( data, status ){
				if( data.bgState ){
					alert( "商品添加成功！" )
				};
			},
			"resetForm" : true,
			"dataType" : "json"
		};
		$( '#addForm' ).ajaxSubmit( options );
	} );
};

/* edit */
function edit( productId ) {
	let params = productId.split( '|' );
	$.ajax( {
		url : `/api/products/single/${params[ 0 ]}`
	} )
	.then( ( result ) => {
		if( result.bgState ){
			// 渲染页面
			let productEditTpl = template.render( productEditView, result.data );
			$( '.content' ).html( productEditTpl );

			/* 编辑事件 */
			editEvent( params[ 1 ] );
		};
	} )
	.fail( ( err ) => {
		console.log( err );
	} );
};

function editEvent( pagination ){
	// 点击返回按钮，返回原来所在页面
	$( '#goBackList' ).attr( 'href', '#/product/' + pagination );

	console.log( $('#editSubmit') )
	// 提交修改后的信息
	$( '#editSubmit' ).off( 'click' ).on( 'click', function(){
		let options = {
			"resetForm" : true,
			"dataType" : "json",
			"success" : function( data, state ){
				console.log( data );
				if( data.data.resMsg ){
					// 刷新页面
					location.hash = '/product/' + pagination;
					alert('修改成功~');
				};
			}
		};
		$( '#editForm' ).ajaxSubmit( options );
	} );
};

/* 搜索 */
function search(){
	$( '#searchBtn' ).on( 'click', function(){
		let keywords = $( '#searchInput' ).val();
		$.ajax( {
			url : '/api/products/search',
			type : 'POST',
			data : {
				keywords
			}
		} )
		.then( ( result ) => {
			console.log( result )
			let productListTpl = template.render( productListView, {
				data : result.data,
				pagination
			} )
			$( '.content' ).html( productListTpl );
		} )
		.fail( ( err ) => {
			console.log( err );
		} );
	} );
};



module.exports = {
	render,
	add,
	edit
};