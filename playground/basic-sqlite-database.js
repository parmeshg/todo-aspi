var Sequelize = require('Sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
		'dialect': 'sqlite',
		 'storage': __dirname+ '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{
	description:{
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			len:[1,250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({
	//force: true
	}).then(function () {
	console.log('Every is synced');
	/*
	Todo.create({
		description:'Take out trash'		
	}).then(function (todo){
		return Todo.create ({
			description: 'clean office'
		});		
	 }).then(function () {
		//return Todo.findById(1);
		return Todo.findAll({
			where:{
				description:{
					$like:'%OFFICE%'
				}
			}
		});
	}).then (function (todos) {
		if(todos){
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			});			
		}else{
			console.log('No todos found!');
		}
	}).catch(function (e) {
		console.log(e);
	});*/

	Todo.findById(1).then(function (todo) {
		if(todo){
			console.log('found');
			console.log(todo.toJSON());
		}else{
			console.log("No not found")
		}
	});

});
