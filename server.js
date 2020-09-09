const express = require('express');

const app = express();
const cors = require('cors')
//use knex to connect to posdtgreSQL database:
const knex = require('knex')
const bodyParser = require('body-parser')

//define and connect to our database:
const db = knex({
  client:'pg',
  connection:{
    host:'127.0.0.1',
    user:'postgres',
    password:'postgress',
    database:'electrostore'
  }  
})


app.use(cors())
app.use(bodyParser.json())

//Rest-Api application contains HTTP protocol methods:GET,POST,PUT and DELETE


app.get('/',(request,response) =>{
    response.json('root page');
});


//POST ENDPOINTS:
//post/add user data endpoints:
app.post('/user',(req,resp) =>{
   //recive data from client side though request.body object:
   const {
    f_name,
    l_name,
    Email_adress,
    house_adress,
    postal_code,
    phone_num,
    cartTotal,
    cartTva
   } = req.body;
  

  //write request data to database:
  //to be continued tomorrow(join the tables ,add fname as primary key)
  db('owner')
   .returning('*')
   .insert(
    {
      fname: f_name,
      lname: l_name,
      email: Email_adress,
      houseadress: house_adress,
      postalcode: postal_code,
      phonenum: phone_num,
      carttotal: cartTotal,
      carttva: cartTva
    }
  ).then((response) =>{
    return resp.json(response);
  })

});


app.post('/cartProducts',(req,resp)=>{
  //we need to write for each product object barnd, model and price
  const {
   f_name,
   productsArr
  } = req.body;

  //insert data by follow promise:
  for(let i=0;i<productsArr.length;i++){
   let time = new Date();
   db('cart1')
   .returning('*')
   .insert({
    firstname: f_name,
    phonebrand: productsArr[i].brand,
    phonemodel: productsArr[i].model,
    price:productsArr[i].price,
    dateorder: time
   })
   .then((response) =>{
    return resp.json(response);
  })
   
  }
});


//GET ENDPOINTS:
//recive data methods endpoints
app.get('/getUser',(req,resp)=>{
  //promise: pending -> resolved or rejected
  db.select('*')
    .from('owner')
    //respond to the client with data in case of success:
    .then((data) =>{
     return resp.send(data).json(); 
    })
    .catch(() =>{
     return resp.statusCode(400).json(); 
    })
});
 
//in this point the client recive the cart data that include owner name and ordered products:
app.get('/getCart',(req,resp)=>{
  //join tables
  /*
  SQL query :
  SELECT * FROM owner INNER JOIN cart ON owner.fname = cart.firstname
  */
  db.select('fname','lname','phonemodel','carttotal','houseadress','email','dateorder')
  .from('owner')
  .innerJoin('cart1','owner.fname','cart1.firstname')
   //respond to the client with data in case of success:
  .then((data) =>{
    return resp.send(data).json()
  })
  .catch(() =>{
    return resp.statusCode(400).json(); 
  })

  // resp.json('get cart data')
});



const PORT = 3020;

app.listen(PORT,()=>{
 console.log('server is open on port',PORT);
})
