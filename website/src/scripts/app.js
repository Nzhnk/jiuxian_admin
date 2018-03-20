const loginCtrl = require( './controllers/loginCtrl.js' );
const productCtrl = require( './controllers/productCtrl.js' );
const welcomeCtrl = require( './controllers/welcomeCtrl.js' );

const Router = require( './utils/routeUtils.js' );

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