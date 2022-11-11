const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
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
    await client.connect();
    const servicesCollection = client.db("Warehouse").collection("services");
    console.log("connected to db");

    // get api for read all service
    app.get("/services", async (req, res) => {
      const query = req.query;
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //add  service
    app.post("/addService", async (req, res) => {
      const newservice = req.body;
      const result = await servicesCollection.insertOne(newservice);
      res.send(result);
    });
  } finally {
  }
}

run().catch((error) => console.log(error));
/* apis */

//    get all services

app.listen(port, () => {
  console.log("port number", port);
});
