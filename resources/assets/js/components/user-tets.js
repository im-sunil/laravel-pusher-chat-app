let myArray = [
  {id: 0, name: "Jhon"},
  {id: 1, name: "Sara"},
  {id: 2, name: "Domnic"},
  {id: 3, name: "Bravo"}
],
    
//Find index of specific object using findIndex method.    
objIndex = myArray.findIndex((obj => obj.id == 1));

//Log object to Console.
console.log("Before update: ", myArray[objIndex])

//Update object's name property.
myArray[objIndex].name = "Laila"

//Log object to console again.
console.log("After update: ", myArray[objIndex])

/*const  online_users = [
	{id: 19, name: "Prof. Madaline Dare III"},
	{id: 2, name: "Prof. Madaline Dare II"},
	{id: 4, name: "Prof. Madaline Dare IV"},
];

const  leavingUser = { id: 19, name: "Raj" };
const found = online_users.filter( ({id} ,i) =>{ 
	console.log(id,i);
});
  
console.log(found);*/
 