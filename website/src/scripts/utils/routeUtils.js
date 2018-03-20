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