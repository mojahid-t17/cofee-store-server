const express = require('express');
const app=express();
const cors = require('cors');
require('dotenv').config();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(express.json())
app.use(cors())
const USER_NAME=process.env.USER_NAME;
const USER_PASS=process.env.USER_PASS;


const uri = `mongodb+srv://${USER_NAME}:${USER_PASS}@cluster0.mtjlx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
const CofeeCollection=client.db('Cofee-store').collection('cofees');
const UserCollection=client.db('Cofee-store').collection('Users');


//  create user
app.post('/users', async(req,res)=>{
  const user=req.body;
  const result=await UserCollection.insertOne(user);
  res.send(result)
})
// display users
app.get('/users',async(req,res)=>{
  const users=UserCollection.find();
  const result=await users.toArray();
  res.send(result)
})
// CRUD operation for coffee
app.get('/cofees', async (req, res) => {
  try {
    const cofee = CofeeCollection.find();
    const result = await cofee.toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching coffees:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/cofees/:id', async(req,res)=>{
  const id=req.params.id;
  const cofee={_id: new ObjectId(id)}
  const result=await CofeeCollection.findOne(cofee)
  res.send(result)
})
app.put('/cofees/:id',async(req,res)=>{
  const id=req.params.id;
  const filter={_id: new ObjectId(id)};
  const options = { upsert: true };
  updatedCofee=req.body;
  const cofee={
    $set:{
      name:updatedCofee.name,
      chef: updatedCofee.chef,
      supplier:updatedCofee.supplier,
      taste:updatedCofee.taste,
      category:updatedCofee.category,
      details:updatedCofee.details,
      photourl:updatedCofee.photourl,
    }
  }
  const result= await CofeeCollection.updateOne(filter,cofee,options)
  res.send(result)
})
app.post('/cofees',async(req,res)=>{
  const cofee=req.body;
  // console.log(cofee)
  const result=await CofeeCollection.insertOne(cofee);
  res.send(result)
 })
 app.delete('/cofees/:id', async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)};
  const result =await CofeeCollection.deleteOne(query);
  res.send(result)
 })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('welcome to cofee store server')
})

app.listen(port,( )=>{
    console.log(`server connected from the port ${port}`)
})