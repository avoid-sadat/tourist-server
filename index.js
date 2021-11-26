const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors= require('cors');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = process.env.PORT || 5000;

//user:traveler pass: 5OMLf4Pgrv0SjAq8
//Middlewear 
app.use(cors());
app.use(express.json());

//db connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9dzrk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("online_shop");
      console.log('database connected');
      const productCollection = database.collection("products");
      const ordersCollection = database.collection("orders");
      const usersCollection = database.collection("users");
//User add
      app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        console.log(result);
        res.json(result);
    });
    //   get data from database
      app.get('/products', async(req,res)=>{
        const cursor =productCollection.find({});
        const products= await cursor.toArray();
        res.send(products);
      });

          //PURCHASE Item
   app.get('/products/:_id',async(req,res)=>{
    const id = req.params._id;
    const query ={_id:ObjectId(id)};
    const product =await productCollection.findOne(query);
    res.json(product);
  });
      //Add orders
      app.post('/orders',async (req,res)=>{
          const order = req.body;
          const result = await ordersCollection.insertOne(order);
          res.json(result);
      });

      //Orders get from DB
      app.get('/orders', async(req,res)=>{
        const cursor = ordersCollection.find({});
        const orders= await cursor.toArray();
        res.send(orders);
      });

        //Oredr Product
   app.post('/orders', async (req, res) => {
    const order = req.body;
    const result = await ordersCollection.insertOne(order);
    res.json(result)
});
app.delete('/orders/:id',async(req,res)=>{
  const id =req.params.id
  const query ={_id:ObjectId(id)};
  const result = await ordersCollection.deleteOne(query);
  // console.log('delete',id);
  res.json(result);
});

  //update status
  app.put('/orders/:id',(req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const filter = { _id: ObjectId(id) };
    console.log(filter)
    // const updateDoc = { $set: {status:status} };
    ordersCollection.updateOne(filter, { $set: {status:status} })
    .then((result)=>{
      res.send(result);
    })
    
});
	  
	  //Delete Orders
	  app.delete('/orders/:id',async(req,res)=>{
		  const id =req.params.id
		  const query ={_id:ObjectId(id)};
		  const result = await ordersCollection.deleteOne(query);
      // console.log('delete',id);
		  res.json(1);
	  });
    //Add product
    app.post('/products',async(req,res)=>{
      const newUser = req.body;
      const result= await productCollection.insertOne(newUser);
      res.json(result);
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
  res.send('the server is running');
})
app.listen(port,()=>{
    console.log('running port',port);
})