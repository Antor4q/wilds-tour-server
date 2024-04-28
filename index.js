const express = require("express");
const cors = require("cors")
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin:["http://localhost:5173","https://wilds-tour.web.app","https://wilds-tour-server.vercel.app"]
}))
app.use(express.json())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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

    app.get("/touristSpots/:id", async (req,res) => {
      const id = req.params.id;
      const cursor = { _id : new ObjectId(id)}
      const result = await spotsCollection.findOne(cursor)
      res.send(result)
    })

    app.get("/myList/:email", async(req,res) => {
   
      const cursor = req.params.email
      const result = await spotsCollection.find({user_email : cursor}).toArray()
      res.send(result)
    })

    app.post("/touristSpots", async(req,res) => {
        const newSpot = req.body;
        const result = await spotsCollection.insertOne(newSpot)
        res.send(result)
    })

    app.put("/myList/:id",async(req,res)=>{
     const id = req.params.id
     const filter = {_id: new ObjectId(id)}
     const options = { upsert : true}
     const update = req.body;
      const spot = {
        $set: {
          image : update.image,
          tourists_spot_name : update.tourists_spot_name,
          countryName : update.countryName,
          location : update.location,
          shortDescription : update.shortDescription,
          average_cost : update.average_cost,
          seasonality : update.seasonality,
          travel_time : update.travel_time,
          totalVisitorsPerYear : update.totalVisitorsPerYear
        }
      }
      const result = await spotsCollection.updateOne(filter,spot,options)
      res.send(result)
    })

    app.delete("/myList/:id", async(req,res) => {
       const id = req.params.id
       const cursor = { _id : new ObjectId(id)}
       const result = await spotsCollection.deleteOne(cursor)
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

