/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const loginCtrl = __webpack_require__( 1 );
const productCtrl = __webpack_require__( 5 );
const welcomeCtrl = __webpack_require__( 10 );

const Router = __webpack_require__( 13 );

loginCtrl.render();
welcomeCtrl.render();

const router = new Router();
router.route( '/', welcomeCtrl.render );
router.route( '/product', productCtrl.render );
router.route( '/productAdd', productCtrl.add );
router.route( '/productEdit', productCtrl.edit );

router.init();

// 高亮状态显示
$( '#leftMenu li' ).on( 'click', function(){
	$( this ).addClass( 'active' ).siblings().removeClass( 'active' );
} );
const hash = location.hash;
$( '#leftMenu li' )
.find( "a[href='" + hash + "']" )
.parent()
.addClass( 'active' ).siblings().removeClass( 'active' );

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const loginView = __webpack_require__( 2 );
const modalView = __webpack_require__( 3 );
const userinfoView = __webpack_require__( 4 );
var wsCache = new WebStorageCache();

// 渲染模板
const render = () => {
	// 验证登录状态
	$.ajax( {
		url : "/api/users/islogin",
		headers : {
			"X-Access-Token" : wsCache.get( 'token' )
		},
		success : function( result ){
			console.log(result);
			const data = JSON.parse( result ).data;
			if( data.isLogin ){
				$( '#modal' ).css( 'display', 'none' );
				// 渲染登录模板
				let loginTpl = template.render( loginView, {
					isLogin : data.isLogin,
					username : data.loginRes
				} );
				$( '.control_self' ).before( loginTpl );

				let userinfoTpl = template.render( userinfoView, {
					username : data.loginRes
				} );
				$( '#username_person' ).html( userinfoTpl );
				// TODO
				changeBtnInfo();
				judgeEvent();
			} else {
				// let modalTpl = template.render(  );
				$( '#modal' ).html( modalView );
				$( '#modal' ).css( 'display', 'block' );

				let second = $( '#to_login b' ).text();
				let timer = null;
				clearInterval( timer );
				timer = setInterval( function(){
					if( second >= 1 ){
						second -= 1;
						$( '#to_login b' ).html( second );
					} else {
						clearInterval( timer );
						location.href = 'login.html';
					};
				}, 1000 );
				$( '#to_loginBtn' ).on( 'click', function(){
					clearInterval( timer );
					location.href = 'login.html';
				} );
			};
		}
	} );
};

// 修改按钮信息
const changeBtnInfo = () => {
	$( '#login_user' ).on( 'click', ( e ) => {
		$( '#username' ).val( '' );
		$( '#password' ).val( '' );
		let btnInfo = $( e.target ).text();
		switch( btnInfo ){
			case '注册' :
				$( '#btn_info' ).text( '注册' );
				break;
			case '登录' :
				$( '#btn_info' ).text( '登录' );
				break;
			default :
				$( '#btn_info' ).text( '注销' );
				break;
		};
	} );
};

// 判断事件
const judgeEvent = () => {
	let btn = $( '#btn_info' );
	btn.on( 'click', () => {
		let btnInfo = $( '#btn_info' ).text();
		switch( btnInfo ){
			case '注册' :
				doRegister();
				break;
			case '登录' :
				doLogin();
				break;
			case '注销' :
				doLoginOut();
				break;
			default : break;
		};
	} );
};



// 注册事件
const doRegister = () => {
	const username = $( '#username' ).val();
	const password = $( '#password' ).val();
	$.ajax( {
		url : '/api/users/isregister',
		method : 'POST',
		data : {
			username,
			password
		},
		success : function( result ){
			console.log( result );
		}
	} );
};

const doLogin = () => {
	const username = $( '#username' ).val();
	const password = $( '#password' ).val();
	$.ajax( {
		url : '/api/users/loginstate',
		method : 'POST',
		data : {
			username,
			password
		},
		success : function( result ){
			console.log(result);
			let data = JSON.parse( result ).data;
			if( data.loginState ){
				// 将token存入本地storage
				wsCache.set( 'token', data.token, { exp : 7200 } );
				wsCache.set( 'username', data.username, { exp : 7200 } );

				// 强制刷新
				// location.reload();
			} else {
				console.log( "登陆失败！" )
			};
		}
	} );
};

const doLoginOut = () => {
	wsCache.delete( 'token' );
	wsCache.delete( 'username' );
	location.href = 'login.html';
};

module.exports = {
	render
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "<!-- Messages: style can be found in dropdown.less--><li class=\"dropdown messages-menu\">	<!-- Menu toggle button -->	<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">		<i class=\"fa fa-envelope-o\"></i>		{{if isLogin}}		<span class=\"label label-success\">4</span>		{{/if}}	</a>	{{if isLogin}}	<ul class=\"dropdown-menu\">		<li class=\"header\">You have 4 messages</li>		<li>			<!-- inner menu: contains the messages -->			<ul class=\"menu\">				<li><!-- start message -->					<a href=\"#\">						<div class=\"pull-left\">							<!-- User Image -->							<img src=\"static/images/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\">						</div>						<!-- Message title and timestamp -->						<h4>							Support Team							<small><i class=\"fa fa-clock-o\"></i> 5 mins</small>						</h4>						<!-- The message -->						<p>Why not buy a new awesome theme?</p>					</a>				</li>				<!-- end message -->			</ul>			<!-- /.menu -->		</li>		<li class=\"footer\"><a href=\"#\">查看所有消息</a></li>	</ul>	{{/if}}</li><!-- /.messages-menu --><!-- Notifications Menu --><li class=\"dropdown notifications-menu\">	<!-- Menu toggle button -->	<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">		<i class=\"fa fa-bell-o\"></i>		{{if isLogin}}		<span class=\"label label-warning\">10</span>		{{/if}}	</a>	{{if isLogin}}	<ul class=\"dropdown-menu\">		<li class=\"header\">You have 10 notifications</li>		<li>			<!-- Inner Menu: contains the notifications -->			<ul class=\"menu\">				<li><!-- start notification -->					<a href=\"#\">						<i class=\"fa fa-users text-aqua\"></i> 5 new members joined today					</a>				</li>				<!-- end notification -->			</ul>		</li>		<li class=\"footer\"><a href=\"#\">全部</a></li>	</ul>	{{/if}}</li><!-- Tasks Menu --><li class=\"dropdown tasks-menu\">	<!-- Menu Toggle Button -->	<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">		<i class=\"fa fa-flag-o\"></i>		{{if isLogin}}		<span class=\"label label-danger\">9</span>		{{/if}}	</a>	{{if isLogin}}	<ul class=\"dropdown-menu\">		<li class=\"header\">You have 9 tasks</li>		<li>			<!-- Inner menu: contains the tasks -->			<ul class=\"menu\">				<li><!-- Task item -->					<a href=\"#\">						<!-- Task title and progress text -->						<h3>							设计按钮							<small class=\"pull-right\">20%</small>						</h3>						<!-- The progress bar -->						<div class=\"progress xs\">							<!-- Change the css width attribute to simulate progress -->							<div class=\"progress-bar progress-bar-aqua\" style=\"width: 20%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\">								<span class=\"sr-only\">20% Complete</span>							</div>						</div>					</a>				</li>				<!-- end task item -->			</ul>		</li>		<li class=\"footer\">			查看所有任务		</li>	</ul>	{{/if}}</li><li class=\"dropdown user user-menu\">	<!-- Menu Toggle Button -->	<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" id=\"login_user\">		<!-- The user image in the navbar-->		<img src=\"static/images/user2-160x160.jpg\" class=\"user-image\" alt=\"User Image\">		<!-- hidden-xs hides the username on small devices so only the image appears. -->		{{if isLogin}}		<span class=\"hidden-xs\">{{username}}</span>		{{/if}}		{{if !isLogin}}		<span class=\"hidden-xs xs_cusome\">注册</span>		<span class=\"hidden-xs xs_cusome\">登录</span>		{{/if}}	</a>	{{if isLogin}}	<ul class=\"dropdown-menu\">		<!-- The user image in the menu -->		<li class=\"user-header\">			<img src=\"static/images/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\">			<p>				{{username}}				<small>Member since Nov. 2012</small>			</p>		</li>		<!-- Menu Body -->		<li class=\"user-body\">			<div class=\"row\">				<div class=\"col-xs-4 text-center\">					<a href=\"#\">花朵</a>				</div>				<div class=\"col-xs-4 text-center\">					<a href=\"#\">销量</a>				</div>				<div class=\"col-xs-4 text-center\">					<a href=\"#\">好友</a>				</div>			</div>			<!-- /.row -->		</li>		<!-- Menu Footer-->		<li class=\"user-footer\">			<div class=\"pull-left\">				<a href=\"#\" class=\"btn btn-primary\" id=\"btn_info\">设置</a>			</div>			<div class=\"pull-right\">				<a href=\"#\" class=\"btn btn-warning\">退出</a>			</div>		</li>	</ul>	{{/if}}	{{if !isLogin}}	<ul class=\"dropdown-menu\">		<!-- The user image in the menu -->		<li class=\"user-header\">			<!-- form start -->			<form class=\"form-horizontal\">				<div class=\"form-group\">					<label for=\"username\" class=\"col-sm-12 control-label label_self\">用户名</label>					<div class=\"col-sm-12\">						<input type=\"email\" class=\"form-control\" id=\"username\" name=\"username\" placeholder=\"请输入用户名\">					</div>				</div>				<div class=\"form-group\">					<label for=\"password\" class=\"col-sm-12 control-label label_self\">密码</label>					<div class=\"col-sm-12\">						<input type=\"password\" class=\"form-control\" id=\"password\" name=\"password\" placeholder=\"请输入密码\">					</div>				</div>			</form>		</li>		<!-- Menu Footer-->		<li class=\"user-footer\">			<div class=\"pull-left\">				<a href=\"#\" class=\"btn btn-primary\" id=\"btn_info\">设置</a>			</div>			<div class=\"pull-right\">				<a href=\"#\" class=\"btn btn-warning\">退出</a>			</div>		</li>	</ul>	{{/if}}</li>"

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "<!-- 模态框（Modal） --><div class=\"modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" style=\"display: block;\" id=\"modal_modal\">	<div class=\"modal-dialog\">		<div class=\"modal-content\">			<div class=\"modal-header alert-danger\">				<h4 class=\"modal-title\" id=\"myModalLabel\">					未登录，请登录后进行相关操作！				</h4>			</div>			<div class=\"modal-body\" id=\"to_login\">				<b>5</b>s之后自动跳转到登录页...			</div>			<div class=\"modal-footer\">				<button type=\"button\" class=\"btn btn-danger\" id=\"to_loginBtn\">去登录</button>			</div>		</div><!-- /.modal-content -->	</div><!-- /.modal --></div>"

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "<p>{{username}}</p><!-- Status --><a href=\"javascript:;\"><i class=\"fa fa-circle text-success\"></i>在线</a>"

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const productListView = __webpack_require__( 6 );
const productAddView = __webpack_require__( 7 );
const paginationView = __webpack_require__( 8 );
const productEditView = __webpack_require__( 9 );

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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "<div class=\"box\" style=\"border-color: #e00;\">	<div class=\"box-header with-border\">		<h3 class=\"box-title pull-left\" style=\"margin-top: 8px;\">商品列表</h3>		<a href=\"#/productAdd\" class=\"btn btn-info pull-right\">添加商品</a>		<div class=\"input-group input-group-sm pull-left\" style=\"width: 150px;margin: 2px 0 0 20px;\">			<input type=\"text\" name=\"table_search\" class=\"form-control\" id=\"searchInput\" placeholder=\"请输入关键字\">			<div class=\"input-group-btn\">				<button type=\"button\" id=\"searchBtn\" class=\"btn btn-default\"><i class=\"fa fa-search\"></i></button>			</div>		</div>	</div>	<div class=\"box-body\">		<!-- <a href=\"#/product/0\"><button class=\"btn btn-default btn-sm\"><i class=\"fa fa-mail-forward\">回到列表首页</i></button></a> -->		<table class=\"table table-bordered\" id=\"form_tr\">			<tr\">				<th>序号</th>				<th>商品图标</th>				<th>中文名称</th>				<th>英文名称</th>				<th>商品价格</th>				<th>商品用途</th>				<th>添加时间</th>				<th>商品操作</th>			</tr>			{{each data}}			<tr class=\"tr_self\">				<td>{{$index+1}}.</td>				<td><img src=\"http://localhost:3000/imgUploads/{{$value.productLogo}}\" alt=\"\" class=\"list_self\"></td>				<td>{{$value.productNamezh}}</td>				<td>{{$value.productNameen}}</td>				<td><span class=\"badge bg-red\">￥{{$value.productPrice}}</span></td>				<td>{{$value.productUses}}</td>				<td>{{$value.createTime}}</td>				<td style=\"width: 160px !important;\">					<a href=\"#/productEdit/{{$value._id}}|{{pagination || 0}}\" class=\"a_self\"><button class=\"btn btn-primary pull-left edit_btn\">更改<span class=\"fa fa-edit\"></span></button></a>					<button class=\"btn btn-warning pull-right\" id=\"{{$value._id}}\">删除<span class=\"fa fa-remove\"></span></button>				</td>			</tr>			{{/each}}		</table>	</div>	<div class=\"box-footer clearfix\" id=\"pagination\">		<!-- 页码 -->	</div></div>"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<div class=\"box box-info\" style=\"border-color: #e00;\">	<div class=\"box-header with-border\">		<h3 class=\"box-title\">新增商品</h3>	</div>	<!-- /.box-header -->	<!-- form start -->	<form class=\"form-horizontal\" id=\"addForm\" action=\"/api/products/add\" enctype=\"multipart/form-data\" method=\"post\">		<div class=\"box-body\">			<div class=\"form-group\">				<label for=\"productNamezh\" class=\"col-sm-2 control-label\">中文名称</label>				<div class=\"col-sm-9\">					<input type=\"email\" class=\"form-control\" id=\"productNamezh\" name=\"productNamezh\" placeholder=\"请输入中文名称\">				</div>			</div>			<div class=\"form-group\">				<label for=\"productNameen\" class=\"col-sm-2 control-label\">英文名称</label>				<div class=\"col-sm-9\">					<input type=\"text\" class=\"form-control\" id=\"productNameen\" name=\"productNameen\" placeholder=\"请输入英文名称\">				</div>			</div>			<div class=\"form-group\">				<label for=\"productLogo\" class=\"col-sm-2 control-label\">商品图标</label>				<div class=\"col-sm-9\">					<input type=\"file\" class=\"form-control\" id=\"productLogo\" name=\"productLogo\" placeholder=\"请选择商品图片\">				</div>			</div><!-- 			<div class=\"form-group\">				<input id=\"lefile\" type=\"file\" style=\"display:none\">				<div class=\"input-append\">					<input id=\"photoCover\" class=\"input-large\" type=\"text\" style=\"height:30px;\">					<a class=\"btn\" onclick=\"$(\'input[id=lefile]\').click();\">Browse</a>				</div>			</div> -->			<div class=\"form-group\">				<label for=\"productUses\" class=\"col-sm-2 control-label\">商品用途</label>				<div class=\"col-sm-9\">					<input type=\"text\" class=\"form-control\" id=\"productUses\" name=\"productUses\" placeholder=\"请输入商品用途\">				</div>			</div>			<div class=\"form-group\">				<label for=\"productPrice\" class=\"col-sm-2 control-label\">商品价格</label>				<div class=\"col-sm-9\">					<input type=\"text\" class=\"form-control\" id=\"productPrice\" name=\"productPrice\" placeholder=\"请输入商品价格\">				</div>			</div>		</div>		<div class=\"box-footer\">			<a href=\"#/product\"><button type=\"button\" class=\"btn btn-default\">返回列表</button></a>			<button type=\"button\" id=\"addSubmit\" class=\"btn btn-info pull-right\">提交</button>			<button type=\"reset\" class=\"btn btn-danger pull-right\" style=\"margin: 0 50px;\">重置</button>		</div>	</form></div>"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<ul class=\"pagination pagination-sm no-margin pull-right\">	<li><a href=\"#/product/0\">首页</a></li>	<% for(var i = 0; i < pageSum; i ++ ){ %>		{{if i == pagination}}			<li class=\"active\"><a href=\"#/product/{{i}}\">{{i+1}}</a></li>		{{else}}			<li><a href=\"#/product/{{i}}\">{{i+1}}</a></li>		{{/if}}	<% } %>	<li><a href=\"#/product/{{pageSum-1}}\">尾页</a></li></ul>"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<div class=\"box box-info\" style=\"border-color: #e00;\">	<div class=\"box-header with-border\">		<h3 class=\"box-title\">编辑商品信息</h3>	</div>	<!-- /.box-header -->	<!-- form start -->	<form class=\"form-horizontal\" id=\"editForm\" action=\"/api/products/edit/{{_id}}\" enctype=\"multipart/form-data\" method=\"post\">		<div class=\"box-body\">			<div class=\"form-group\">				<label for=\"productNamezh\" class=\"col-sm-2 control-label\">中文名称</label>				<div class=\"col-sm-9\">					<input type=\"email\" class=\"form-control\" id=\"productNamezh\" name=\"productNamezh\" placeholder=\"请输入中文名称\" value=\"{{productNamezh}}\">				</div>			</div>			<div class=\"form-group\">				<label for=\"productNameen\" class=\"col-sm-2 control-label\">英文名称</label>				<div class=\"col-sm-9\">					<input type=\"text\" class=\"form-control\" id=\"productNameen\" name=\"productNameen\" placeholder=\"请输入英文名称\" value=\"{{productNameen}}\">				</div>			</div>			<div class=\"form-group\">				<label for=\"productLogo\" class=\"col-sm-2 control-label\">商品图标</label>				<div class=\"col-sm-9\">					<img src=\"http://localhost:3000/imgUploads/{{productLogo}}\" alt=\"\" style=\"width: 180px;height: 180px;\">				</div>				<div class=\"col-sm-9 col-sm-offset-2\">					<input type=\"file\" class=\"form-control\" id=\"productLogo\" name=\"productLogo\" placeholder=\"请选择商品图片\">				</div>			</div>			<div class=\"form-group\">				<label for=\"productUses\" class=\"col-sm-2 control-label\">商品用途</label>				<div class=\"col-sm-9\">					<input type=\"text\" class=\"form-control\" id=\"productUses\" name=\"productUses\" placeholder=\"请输入商品用途\" value=\"{{productUses}}\">				</div>			</div>			<div class=\"form-group\">				<label for=\"productPrice\" class=\"col-sm-2 control-label\">商品价格</label>				<div class=\"col-sm-9\">					<input type=\"text\" class=\"form-control\" id=\"productPrice\" name=\"productPrice\" placeholder=\"请输入商品价格\" value=\"{{productPrice}}\">				</div>			</div>		</div>		<div class=\"box-footer\">			<a href=\"#/product\" id=\"goBackList\" ><button type=\"button\" class=\"btn btn-default\">返回列表</button></a>			<button type=\"button\" id=\"editSubmit\" class=\"btn btn-info pull-right\">提交修改信息</button>		</div>	</form></div>"

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const welcomeView = __webpack_require__( 11 );
const meetView = __webpack_require__( 12 );

const render = () => {
	const welcomeTpl = template.render( welcomeView, {
		welcome : "欢迎使用丝芙兰信息管理系统！",
		hello : "您好！管理员~",
		level1 : "首页",
		level2 : "欢迎页面",
		url : "#/"
	} );
	$( '.content-header' ).html( welcomeTpl );
	$( '.content' ).html( meetView );
};

module.exports = {
	render
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<h1>	{{welcome}}	<small>{{hello}}</small></h1><ol class=\"breadcrumb\">	<li><a href=\"{{url}}\"><i class=\"fa fa-bars\"></i>{{level1}}</a></li>	<li class=\"active\">{{level2}}</li></ol>"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "<div>	<p>本网站是使用了一系列不可描述的技术设计而成！！！</p></div>"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function Router(){
	this.routes = {};
	this.currentUrl = '';
};

Router.prototype.route = function( hash, callback ){
	this.routes[ hash ] = callback || function(){};
};

Router.prototype.refresh = function(){
	let hash = this.parseHash( location.hash.slice( 1 ) );
	this.currentUrl = '/' + ( hash.route || '' );
	this.routes[ this.currentUrl ]( hash.param );
};

Router.prototype.init = function(){
/*	let newHash =  '/' + ( this.parseHash( location.hash.slice( 1 ) ).route || '' );
	this.routes[ newHash ]();*/
	this.refresh()
	// 监测hash的变化
	window.addEventListener( 'hashchange', this.refresh.bind( this ), false );
};

Router.prototype.parseHash = function( hash ){
	const hashArr = hash.split( '/' );

	return {
		route : hashArr[ 1 ],
		param : hashArr[ 2 ] || ''
	};
};

module.exports = Router;

/***/ })
/******/ ]);