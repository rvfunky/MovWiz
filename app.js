// BASE SETUP
// =============================================================================

var path			 	= require('http');
var path			 	= require('https');
var path			 	= require('path');
var bodyParser 	= require('body-parser');
var express    	= require('express');
var request 		= require('request');
/*
 * Testing mongodb*/
var DAO;
var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');

// Connection URL

//var url = 'mongodb://predict:success@aws-us-east-1-portal.18.dblayer.com:10247/movies';
// Use connect method to connect to the Server

/*............................*/

var app = express(); // define our app using express

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = (process.env.VCAP_APP_PORT || process.env.PORT || 3000);
var host = (process.env.VCAP_APP_HOST || process.env.HOST || 'localhost');

var env = { };

var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
console.log(services);
var service = (services['pm-20'] || "{}");
var credentials = service[0].credentials;
if (credentials != null) {
	env.baseURL = credentials.url;
	env.accessKey = credentials.access_key;
}

var compose =services["user-provided"][0].credentials;
var url = 'mongodb://'+compose.user+':'+compose.password+'@'+compose.uri + ':' + compose.port + '/movies' ;

var rootPath = '/score';

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 	// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	next(); // make sure we go to the next routes and don't stop here
});

// env request

// score request
router.post('/', function(req, res) {
	var scoreURI = env.baseURL + '/score/' + req.body.context + '?accesskey=' + env.accessKey;
	console.log('=== SCORE ===');
	console.log('  URI  : ' + scoreURI);
	console.log('  Input: ' + JSON.stringify(req.body.input));
	console.log(' ');
	try {
		var r = request.post(scoreURI, { json: true, body: req.body.input });
		req.pipe(r);
		r.pipe(res);
	} catch (e) {
		console.log('Score exception ' + JSON.stringify(e));
		var msg = '';
		if (e instanceof String) {
			msg = e;
		} else if (e instanceof Object) {
			msg = JSON.stringify(e);
		}
		res.status(200);
		return res.send(JSON.stringify({
			flag: false,
			message: msg
		}));
	}

	process.on('uncaughtException', function (err) {
		console.log(err);
	});
});

router.get('/', function(req, res) {
	res.json(env);
});

// Register Service routes and SPA route ---------------

// all of our service routes will be prefixed with rootPath
app.use(rootPath, router);

// SPA AngularJS application served from the root
app.use(express.static(path.join(__dirname, 'public')));

app.post('/getDirector',function(req,res){


	var query={};
	console.log("director" + req.param("director") + " Actor:" + req.param("actor") + " Genre:" + req.param("genre")	);

	if(req.param("director")!="" && req.param("director")!=undefined ){
		query.Director=req.param("director");
	}
	if(req.param("actor")!="" && req.param("actor")!=undefined){
		query.Actor=req.param("actor");
	}
	if(req.param("genre")!="" && req.param("genre")!=undefined){
		query.Genre=req.param("genre");
	}
	console.log("query:" + JSON.stringify(query));

	if("Director" in query || "Actor" in query || "Genre" in query){
		DAO.collection('details').find(query).toArray(function(err,data){
			if(err)
			{

				res.send({statusCode:401,errmsg:"Mongo Error"});
			}
			else
			{
				if(data.length>0)
				{
					console.log("data"+data);
					res.send({statusCode:200,result:data});
				}
				else
				{
					res.send({statusCode:200,errmsg:"No Results"});
				}

			}

		});
	}


});


app.post('/getAverageValue',function(req,res){
	var query={};
	if(req.param("actor")!="" && req.param("actor")!=undefined ){
		query._id= req.param("actor");
	}

	if("_id" in query){
		DAO.collection('actorSuccess').find(query).toArray(function(err,actordata){
			if(err)
			{

				res.send({statusCode:401,errmsg:"Mongo Error"});
			}
			else
			{
				if(actordata.length>0)
				{

					var query={};
					if(req.param("genre")!="" && req.param("genre")!=undefined ){
						query._id= req.param("genre");
					}

					if("_id" in query){
						DAO.collection('genreSuccess').find(query).toArray(function(err,genredata){
							if(err)
							{

								res.send({statusCode:401,errmsg:"Mongo Error"});
							}
							else
							{
								if(genredata.length>0)
								{
									var query={};
									if(req.param("director")!="" && req.param("director")!=undefined ){
										query._id= req.param("director");
									}

									if("_id" in query){
										DAO.collection('directorSuccess').find(query).toArray(function(err,directordata){
											if(err)
											{

												res.send({statusCode:401,errmsg:"Mongo Error"});
											}
											else
											{
												if(directordata.length>0)
												{
													console.log(" director avg data"+directordata[0].success +" -" +
														actordata[0].success + "- " + genredata[0].success);
													var avgresult = (parseFloat(directordata[0].success) +
														parseFloat(actordata[0].success) + parseFloat(genredata[0].success))/3;
													res.send({statusCode:200, result: avgresult});
												}
												else
												{
													res.send({statusCode:200,errmsg:"No Results"});
												}

											}

										});
									}
								}
								else
								{
									res.send({statusCode:200,errmsg:"No Results"});
								}

							}

						});
					}

				}
				else
				{
					res.send({statusCode:200,errmsg:"No Results"});
				}

			}
		});
	}
});

app.post('/getResults',function(req,res){
	query=[
		{$match:{"Director":req.param("director"),"Actor":req.param("actor"),"Genre":req.param("genre")}},
		{$project:{"Rating":1,"Director":1,"Actor":1,"Genre":1}},
		{$group:{_id:null,success:{$avg:"$Rating"}}}
	];
	console.log(query);

	DAO.collection('details').aggregate(query).toArray(function(err,data){
		if(err)
		{
			res.send({statusCode:401,errmsg:"Mongo Error"});
		}
		else
		{
			if(data.length>0)
			{
				res.send({statusCode:200,result:data});
			}
			else
			{
				res.send({statusCode:200,errmsg:"No Results"});
			}
		}
	});
});


// START THE SERVER with a little port reminder when run on the desktop
// =============================================================================
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	DAO = db;

	app.listen(port, host);
	console.log('App started on port ' + port);

});
