const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

/* middle wares */
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://<username>:<password>@cluster0.esmmy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

/* api's */
app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log("port number", port);
});
