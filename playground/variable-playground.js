// obj example
var person = {
	name: 'Parmesh',
	age :21
}

function updatePerson(obj) {
	/*obj = {
		name:'Parmesh',
		age:24
	}*/
	obj.age = 24;
}

updatePerson(person);
console.log(person);

//Array example
var grades = [15,88];

function addGrades (gradesArr){
	//gradesArr = [12,33,99];
	gradesArr.push(55);
}

addGrades(grades);
console.log(grades);