const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express(); // ✅ Define Express app
const port = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ["http://localhost:5173", "https://cofee-store-b9f7b.web.app"],
  credentials: true,
  operationSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));

const USER_NAME = process.env.USER_NAME;
const USER_PASS = process.env.USER_PASS;

const uri = `mongodb+srv://${USER_NAME}:${USER_PASS}@cluster0.mtjlx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect(); // Ensure the DB connects

    const CofeeCollection = client.db("Cofee-store").collection("cofees");
    const UserCollection = client.db("Cofee-store").collection("Users");

    // Routes...
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await UserCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const users = await UserCollection.find().toArray();
      res.send(users);
    });

    app.get("/cofees", async (req, res) => {
      try {
        const cofee = await CofeeCollection.find().toArray();
        res.send(cofee);
      } catch (error) {
        console.error("Error fetching coffees:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/cofees/:id", async (req, res) => {
      const id = req.params.id;
      const result = await CofeeCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.put("/cofees/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCofee = req.body;
      const result = await CofeeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCofee },
        { upsert: true }
      );
      res.send(result);
    });

    app.post("/cofees", async (req, res) => {
      const cofee = req.body;
      const result = await CofeeCollection.insertOne(cofee);
      res.send(result);
    });

    app.delete("/cofees/:id", async (req, res) => {
      const id = req.params.id;
      const result = await CofeeCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to Coffee Store Server");
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
