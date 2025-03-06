const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());

// Define CORS options
const corsOptions = {
  origin: ['http://localhost:5000', 'https://cofee-store-b9f7b.web.app/'], // Add allowed domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

const USER_NAME = process.env.USER_NAME;
const USER_PASS = process.env.USER_PASS;

const uri = `mongodb+srv://${USER_NAME}:${USER_PASS}@cluster0.mtjlx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const CofeeCollection = client.db('Cofee-store').collection('cofees');
    const UserCollection = client.db('Cofee-store').collection('Users');

    // Create user
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await UserCollection.insertOne(user);
      res.send(result);
    });

    // Display users
    app.get('/users', async (req, res) => {
      const users = UserCollection.find();
      const result = await users.toArray();
      res.send(result);
    });

    // CRUD operations for coffee
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

    app.get('/cofees/:id', async (req, res) => {
      const id = req.params.id;
      const cofee = { _id: new ObjectId(id) };
      const result = await CofeeCollection.findOne(cofee);
      res.send(result);
    });

    app.put('/cofees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCofee = req.body;
      const cofee = {
        $set: {
          name: updatedCofee.name,
          chef: updatedCofee.chef,
          supplier: updatedCofee.supplier,
          taste: updatedCofee.taste,
          category: updatedCofee.category,
          details: updatedCofee.details,
          photourl: updatedCofee.photourl,
        },
      };
      const result = await CofeeCollection.updateOne(filter, cofee, options);
      res.send(result);
    });

    app.post('/cofees', async (req, res) => {
      const cofee = req.body;
      const result = await CofeeCollection.insertOne(cofee);
      res.send(result);
    });

    app.delete('/cofees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CofeeCollection.deleteOne(query);
      res.send(result);
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to Coffee Store Server');
});

app.listen(port, () => {
  console.log(`Server connected on port ${port}`);
});
