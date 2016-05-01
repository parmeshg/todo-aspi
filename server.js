var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require("underscore");

var PORT = process.env.PORT || 3000;
var todos= [];
var todoNextId = 1;


app.use(bodyParser.json());

app.get('/',function (res,res){
	res.send('TODO API root');
});

app.get('/todos',function (req,res){
	res.json(todos);	
});

app.get('/todos/:id',function (req,res){
	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	/*var matchedTodo;

	todos.forEach(function (todo){
		if ( todoId === todo.id ){
			matchedTodo = todo;			
		}
	});*/

	if (matchedTodo){
		res.json(matchedTodo);		
	}else {
		res.status(404).send();	
	}
});

// POST /todos
app.post('/todos',function (req,res){
	var body = _.pick(req.body, 'description', 'completed' );

	if(!_.isBoolean(body.completed) || !_.isString(body.description)  || body.description.trim().length === 0)  {
		return res.status(400).send();
	}
	body.description = body.description.trim();
	/*
	var body = req.body;
	console.log('todoNextId: ' + todoNextId);
	console.log('description: ' + body.description);
	console.log('completed: ' + body.completed);
	*/
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

app.delete('/todos/:id',function (req,res){
	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo)  {
		return res.status(400).json({"error":"no todo found with given id"});
	} else {
       todos = _.without(todos, matchedTodo);
       res.json(matchedTodo);
	}
});


app.listen(PORT, function (){
	console.log('TODO API web server is started on ' + PORT);
});

