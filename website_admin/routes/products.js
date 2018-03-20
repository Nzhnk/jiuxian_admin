var express = require( 'express' );
var router = express.Router();

const ProductCtrl = require( '../controllers/productCtrl.js' );
const ImgUploads = require( '../middlewares/imgUploads' );

router.route( '/list/:pagination' )
	.get( ProductCtrl.list );

/* add */
router.route( '/add' )
	.post( ImgUploads( 'productLogo' ), ProductCtrl.add );

/* edit */
router.route( '/edit/:productId' )
	.post( ImgUploads( 'productLogo' ), ProductCtrl.edit );

/* single */
router.route( '/single/:productId' )
	.get( ProductCtrl.single );

router.route( '/remove/:productId' )
	.get( ProductCtrl.remove );

router.route( '/search' )
	.post( ProductCtrl.search );

module.exports = router;