var express = require('express');
var bodyParser = require('body-parser');
var app = express();
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
	var matchedTodo;

	todos.forEach(function (todo){
		if ( todoId === todo.id ){
			matchedTodo = todo;			
		}
	});

	if (matchedTodo){
		res.json(matchedTodo);		
	}else {
		res.status(404).send();	
	}
});

// POST /todos
app.post('/todos',function (req,res){
	var body = req.body;
	console.log('todoNextId: ' + todoNextId);
	console.log('description: ' + body.description);
	console.log('completed: ' + body.completed);
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

app.listen(PORT, function (){
	console.log('TODO API web server is started on ' + PORT);
});

