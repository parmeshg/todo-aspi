var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require("underscore");
var db =require('./db.js');
var middleware = require('./middleware.js')(db);

var PORT = process.env.PORT || 3000;
var todos= [];
var todoNextId = 1;


app.use(bodyParser.json());

app.get('/',function (res,res){
	res.send('TODO API root');
});

//GET /todos?completed=true&q=work
app.get('/todos',middleware.requireAuthentication,function (req,res){
	var query = req.query;
    var where = {
    	userId: req.user.get('id')
    };
    
    if (query.hasOwnProperty('completed') && query.completed === 'true') {
    	where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    	where.completed = false;
    } 	

    if ( query.hasOwnProperty('q') && query.q.length > 0) {
    	where.description={
    		$like : '%' + query.q +'%'
    	};
    }

    db.todo.findAll({where: where}).then(function (todos) {
    	res.json(todos);
    }, function (e) {
    	res.status(500).send();
    });

});

app.get('/todos/:id',middleware.requireAuthentication,function (req,res){
	var todoId = parseInt(req.params.id,10);
	
	db.todo.findOne({
		where:{
			id:todoId,
			userId: req.user.get('id')
			}
		}
		).then(function (todo) {
		if(!!todo){			
			res.json(todo.toJSON());
		} else {			
			res.status(404).send();
		}		
	}, function (e) {
			res.status(500).send();
	});
});

// POST /todos
app.post('/todos',middleware.requireAuthentication,function (req,res){
	var body = _.pick(req.body, 'description', 'completed' );

	db.todo.create(body).then(function (todo) {		
		req.user.addTodo(todo).then(function(){
			return todo.reload();
		}).then(function (todo) {
			res.json(todo.toJSON());	
		});
	}, function (e) {
		res.status(400).json(e);
	});
	/*if(!_.isBoolean(body.completed) || !_.isString(body.description)  || body.description.trim().length === 0)  {
		return res.status(400).send();
	}
	body.description = body.description.trim();
	
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);*/

	/*
	var body = req.body;
	console.log('todoNextId: ' + todoNextId);
	console.log('description: ' + body.description);
	console.log('completed: ' + body.completed);
	*/
});

app.delete('/todos/:id',middleware.requireAuthentication,function (req,res){
	var todoId = parseInt(req.params.id,10);

	db.todo.destroy({
		where:{
			id: todoId,
			userId: req.user.get('id')
		}
	}).then ( function (rowsDeleted) {
		if(rowsDeleted === 0) {
			res.status(404).json({error: 'No todo with id'});
		} else {
			res.status(204).send();
		}
	} , function () {
		res.status(500).send();
	});	
});

app.put('/todos/:id',middleware.requireAuthentication,function (req,res){
    var todoId = parseInt(req.params.id,10);
	var body = _.pick(req.body, 'description', 'completed' );
    var attributes = {};

	if (body.hasOwnProperty('completed') ){
		attributes.completed = body.completed;
	} 

	if (body.hasOwnProperty('description')){
		attributes.description = body.description;
	}
	
	db.todo.findOne({
		where:{
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
	if (todo) {
			todo.update(attributes).then( function (todo) {
		res.json(todo.toJSON());		
	}, function (e) {
		res.status(400).json(e);
	});
		}else {
			res.status(404).send();
		}
	}, function(){
		res.status(500).send();
	})
});

// POST /user
app.post('/users',function (req,res){
	var body = _.pick(req.body, 'email', 'password' );

	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

// POST /users/login
app.post('/users/login',function (req,res){
	var body = _.pick(req.body, 'email', 'password' );
	var userInstace;

	db.user.authenticate(body).then( function (user) {
		var token = user.generateToken('authentication');
		userInstace=user;
		return db.token.create({
			token: token
		});

	}).then(function (tokenInstance) {
		res.header('Auth',tokenInstance.get('token')).json(userInstace.toPublicJSON());
	}).catch(function(e) {
		console.log('******');
		console.log(e);
		return res.status(401).send();
	});	
});

// DELETE /user/login
app.delete('/users/login',middleware.requireAuthentication,function(req,res) {
	req.token.destroy().then(function () {
		res.status(204).send();
	}).catch(function () {
		res.status(500).send();
	});
});

db.sequelize.sync(
	{force: true}
	).then( function () {
	app.listen(PORT, function (){
	console.log('TODO API web server is started on ' + PORT);
});
});


