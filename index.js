const express = require("express");
const cors = require("cors")
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin:["http://localhost:5173","https://wilds-tour.web.app"]
}))
app.use(express.json())

// touristsSpots
// O8Q8lcnod73OVBi2



const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://touristsSpots:O8Q8lcnod73OVBi2@cluster0.i8hseoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i8hseoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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

    const spotsCollection =  client.db("touristDB").collection("touristSpots")

    app.get("/touristSpots", async(req,res) => {
        const cursor = spotsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.post("/touristSpots", async(req,res) => {
        const newSpot = req.body;
        const result = await spotsCollection.insertOne(newSpot)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req,res) => {
    res.send("Wilds Tour Server Is Running")
})

app.listen(port, ()=> {
    console.log(`Wilds Tour Server Is Running on Port : ${port}`)
})

// https://wilds-tour.web.app

// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/programming-hero-web-course-4/b9a10-server-side-Antor4q.git
// git push -u origin main