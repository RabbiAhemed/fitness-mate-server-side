const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
/* middle wares */
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.esmmy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //   connect the client
    // await client.connect();
    const servicesCollection = client.db("fitnessMate").collection("services");
    const reviewsCollection = client.db("fitnessMate").collection("reviews");
    console.log("connected to db");

    // get api for read all service
    app.get("/services", async (req, res) => {
      const query = req.query;
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    // get a single service by id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    //add  service
    app.post("/addService", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      newService.service_id = result.insertedId;
      res.send(result);
    });
    //add  review
    app.post("/addReview", async (req, res) => {
      const newreview = req.body;
      const result = await reviewsCollection.insertOne(newreview);
      res.send(result);
    });
    // jwt
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const secretToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2h",
      });
      res.send({ secretToken });
    });
  } finally {
  }
}

run().catch((error) => console.log(error));
app.get("/", (req, res) => {
  res.send("server running properly");
});

app.listen(port, () => {
  console.log("port number", port);
});
