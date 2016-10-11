'use strict';

var express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	nunjucks = require('nunjucks');

module.exports = function() {
	var app = express(); 
	
	app.use(logger('dev'));
	app.disable('x-powered-by');
	app.engine( 'html', nunjucks.render ) ;
	app.set( 'view engine', 'html' ) ;

	app.use(express.static(path.join(__dirname, '../public'))); 

	nunjucks.configure(path.join(__dirname,'../app/views'), {
		autoescape: true,
		cache: false,
		watch: true,
		express: app,
		tags: {
			blockStart: '<%',
			blockEnd: '%>',
			variableStart: '<$',
			variableEnd: '$>',
			commentStart: '<#',
			commentEnd: '#>'
		}
	}) ;
	
	app.use('*', function (req, res, next){
		res.render('layout');
	});
	app.get('*',function(req, res, next) {
		res.render('index');
	});

	return app;
};