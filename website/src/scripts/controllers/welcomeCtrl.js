const welcomeView = require( '../views/welcome.html' );
const meetView = require( '../views/meet.html' );

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